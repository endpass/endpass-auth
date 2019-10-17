// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import identityService from '@/service/identity';
import {
  authStore as authStoreModule,
  accountsStore as accountsStoreModule,
} from '@/store';

/**
 * @typedef { import("@/store/modules/AccountsModule").default } AccountsModule
 * @typedef { import("@/store/modules/AuthModule").default } AuthModule
 */

@Module({ generateMutationSetters: true })
class RecoverController extends VuexModule {
  /**
   * @param {import('vuex-class-modules').RegisterOptions} props
   * @param {object} params
   * @param {AccountsModule} [params.accountsStore]
   * @param {AuthModule} [params.authStore]
   */
  constructor(
    props,
    { authStore = authStoreModule, accountsStore = accountsStoreModule } = {},
  ) {
    super(props);
    this.authStore = authStore;
    this.accountsStore = accountsStore;
  }

  /**
   * Send sms with code for disabling otp
   * @param {object} param
   * @param {string} param.email
   * @returns {Promise<void>}
   */
  @Action
  async sendSms({ email }) {
    await identityService.sendOtpRecoverSms(email);
  }

  /**
   * Disable otp setting
   * @param {object} param
   * @param {string} param.email
   * @param {string} param.code
   * @returns {Promise<void>}
   */
  @Action
  async disableOtp({ email, code }) {
    await identityService.disableOtpViaSms({ email, code });
    await Promise.all([
      this.accountsStore.disableOtpInStore(),
      this.authStore.disableOtpInStore(),
    ]);
  }
}

export default () => createController(RecoverController);
