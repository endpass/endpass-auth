import { Action, VuexModule, Module, Mutation } from 'vuex-class-modules';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import ConnectError from '@endpass/class/ConnectError';
import identityService from '@/service/identity';
import signer from '@/class/singleton/signer';
import settingsService from '@/service/settings';
import modeService from '@/service/mode';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import i18n from '@/locales/i18n';
import { authChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import { METHODS } from '@/constants';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class AuthModule extends VuexModule {
  authParams = null;

  otpEmail = null;

  isLogin = false;

  isPermission = false;

  constructor(props, { sharedStore }) {
    super(props);
    this.sharedStore = sharedStore;
  }

  get isAuthorized() {
    return this.isLogin && this.isPermission;
  }

  @Action
  async loadAuthChallenge({ email }) {
    const request = identityService.getAuthChallenge(email);

    await this.handleAuthRequest({
      request,
      email,
    });
  }

  @Action
  async authWithGoogle({ email, idToken }) {
    const request = identityService.authWithGoogle(idToken);

    await this.handleAuthRequest({
      request,
      email,
    });
  }

  @Action
  async authWithGitHub(code) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      const res = await identityService.authWithGitHub(code);

      if (!res.success) {
        throw new Error(res.message || i18n.t('store.auth.authFailed'));
      }

      settingsService.clearLocalSettings();

      const type = get(res, 'challenge.challengeType');
      if (type === 'otp') {
        this.otpEmail = res.email;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async handleAuthRequest({ email, request }) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      const res = await request;

      if (!res.success) throw new Error(i18n.t('store.auth.authFailed'));

      settingsService.clearLocalSettings();

      const type = get(res, 'challenge.challengeType');
      this.otpEmail = type === 'otp' ? email : null;
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async authByCode({ email, code, password, isSignUp }) {
    await identityService.auth({ email, code, password, isSignUp });
    await this.defineAuthStatus();
  }

  @Action
  async sendCode({ email }) {
    await identityService.sendEmailCode(email);
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

  @Action
  async disableOtp({ seedPhrase }) {
    const recoveryIdentifier = await identityService.getRecoveryIdentifier(
      this.otpEmail,
    );

    const signature = await signer.recover({
      seedPhrase,
      recoveryIdentifier,
    });

    const redirectUrl = get(this, 'authParams.redirectUrl', '');

    const { success } = await identityService.disableOtp(
      this.otpEmail,
      signature,
      redirectUrl,
    );

    return success;
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
    await identityService.waitLogin();
    await this.defineAuthStatus();
    // authChannel.put(Answer.createOk());
  }

  @Action
  async defineAuthStatus() {
    const status = await identityService.getAuthStatus();
    const settings = settingsService.getLocalSettings();

    if (status !== 200 && !isEmpty(settings)) {
      settingsService.clearLocalSettings();
    }

    await this.changeAuthStatusByCode(status);
    return status;
  }

  @Mutation
  setAuthByCode(code) {
    this.isLogin = code === 403 || code === 200;
    this.isPermission = code === 200;
  }

  @Action
  changeAuthStatusByCode(code) {
    const { isAuthorized } = this;
    this.setAuthByCode(code);
    const isAuthorizedNew = this.isAuthorized;
    if (isAuthorizedNew !== isAuthorized) {
      bridgeMessenger.send(METHODS.AUTH_STATUS, isAuthorizedNew);
    }
  }

  @Mutation
  setAuthParams(params) {
    this.authParams = params;
  }

  @Mutation
  logout() {
    this.otpEmail = null;
    this.authParams = null;
    this.isPermission = false;
    this.isLogin = false;
  }
}

export default AuthModule;
