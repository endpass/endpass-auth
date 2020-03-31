import { Action, VuexModule, Module, Mutation } from 'vuex-class-modules';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import ConnectError from '@endpass/connect/error';
import identityService from '@/service/identity';
import settingsService from '@/service/settings';
import authService from '@/service/auth';
import modeService from '@/service/mode';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import i18n from '@/locales/i18n';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import { METHODS, CHALLENGE_TYPES, AUTH_STATUS_CODE } from '@/constants';
import CookieExpireChecker from '@/class/CookieExpireChecker';
import NonReactive from '@/class/NonReactive';

const { ERRORS } = ConnectError;

const STATUS_TO_CODE = {
  DEFAULT: 401,
  [AUTH_STATUS_CODE.LOGGED_IN]: 200,
  [AUTH_STATUS_CODE.NOT_LOGGED]: 401,
  [AUTH_STATUS_CODE.NEED_PERMISSION]: 403,
  [AUTH_STATUS_CODE.LOGOUT]: 400,
};

@Module({ generateMutationSetters: true })
class AuthModule extends VuexModule {
  authParams = null;

  cookieExpireChecker = new NonReactive(new CookieExpireChecker());

  /** @type {CHALLENGE_TYPES[keyof CHALLENGE_TYPES]?} */
  challengeType = CHALLENGE_TYPES.EMAIL_OTP;

  isLogin = false;

  isPhoneExist = false;

  isPasswordExist = false;

  isPermission = false;

  isRemembered = false;

  constructor(props, { sharedStore }) {
    super(props);
    this.sharedStore = sharedStore;
  }

  get isAuthorized() {
    return this.isLogin && this.isPermission;
  }

  @Action
  async authWithGoogle({ idToken }) {
    const { email } = await authService.authWithGoogle(idToken);

    await this.loadAuthChallenge({
      email,
    });

    return { email };
  }

  @Action
  async authWithGitHub(code) {
    const { email } = await authService.authWithGitHub(code);

    await this.loadAuthChallenge({
      email,
    });

    return { email };
  }

  @Action
  async loadAuthChallenge({ email }) {
    this.sharedStore.changeLoadingStatus(true);
    try {
      const res = await authService.getAuthChallenge(email);

      if (!res.success) throw new Error(i18n.t('store.auth.authFailed'));

      settingsService.clearLocalSettings();

      this.challengeType = get(res, 'challenge.challengeType');
      this.isRemembered = get(res, 'remembered');
      this.isPhoneExist = get(res, 'hasPhone');
      this.isPasswordExist = get(res, 'hasPassword');
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async sendCode({ email }) {
    await authService.sendEmailCode(email);
  }

  @Action
  async resetRegularPassword({ email }) {
    await identityService.resetRegularPassword({ email });
  }

  @Action
  async confirmResetRegularPassword({ code, password }) {
    await identityService.confirmResetRegularPassword({ code, password });
  }

  @Action
  confirmAuth(serverMode) {
    authChannel.put(Answer.createOk(serverMode));
  }

  @Action
  cancelAuth() {
    authChannel.put(
      Answer.createFail(
        ERRORS.AUTH_CANCELED_BY_USER,
        i18n.t('store.auth.authCanceled'),
      ),
    );
  }

  /**
   * Disable otp mode
   */
  @Action
  async disableOtpInStore() {
    this.challengeType = CHALLENGE_TYPES.EMAIL_OTP;
  }

  @Action
  async checkRegularPassword(email) {
    return identityService.checkRegularPassword(email);
  }

  @Action
  async validateCustomServer(serverUrl) {
    return modeService.validateIdentityServer(serverUrl);
  }

  @Action
  async waitLogin() {
    await authService.waitLogin();
    await this.defineAuthStatus();
  }

  @Action
  async defineAuthStatus() {
    const { status, hash, expiresAt } = await authService.getAuthStatus();

    const settings = settingsService.getLocalSettings();

    if (status !== AUTH_STATUS_CODE.LOGGED_IN && !isEmpty(settings)) {
      settingsService.clearLocalSettings();
    }

    await this.changeAuthByStatus({ status, hash });

    if (this.isAuthorized && expiresAt) {
      this.cookieExpireChecker.value.setExpireAt(expiresAt);
      this.cookieExpireChecker.value.startChecking();
    }
  }

  @Mutation
  updateAuthStateByStatus(status) {
    this.isLogin =
      status === AUTH_STATUS_CODE.NEED_PERMISSION ||
      status === AUTH_STATUS_CODE.LOGGED_IN;
    this.isPermission = status === AUTH_STATUS_CODE.LOGGED_IN;
  }

  @Action
  changeAuthByStatus({ status, hash }) {
    this.updateAuthStateByStatus(status);
    const isAuthorizedNew = this.isAuthorized;

    const code = STATUS_TO_CODE[status] || STATUS_TO_CODE.DEFAULT;

    bridgeMessenger.send(METHODS.AUTH_STATUS, {
      status: isAuthorizedNew,
      code,
      hash,
    });
  }

  @Mutation
  setAuthParams(params) {
    this.authParams = params;
  }

  @Action
  logout() {
    this.cookieExpireChecker.value.setExpireAt(0);
    this.cookieExpireChecker.value.stopChecking();
    this.changeAuthByStatus({ status: AUTH_STATUS_CODE.LOGOUT, hash: '' });
    this.challengeType = CHALLENGE_TYPES.EMAIL_OTP;
    this.setAuthParams(null);
    settingsService.clearLocalSettings();
  }
}

export default AuthModule;
