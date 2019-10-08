import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import { authStore as authStoreModule } from '@/store';
import identityService from '@/service/identity';

@Module({ generateMutationSetters: true })
class AuthController extends VuexModule {
  constructor(props, { authStore = authStoreModule }) {
    super(props);
    this.authStore = authStore;
  }

  /**
   *
   * @param {boolean} isSignUp
   * @param {string} email
   * @param {string} password
   * @param {string} code
   * @return {Promise<void>}
   */
  @Action
  async authWithCode({ isSignUp, email, password, code }) {
    await identityService.authWithCode({ email, code, password, isSignUp });
    await this.authStore.defineAuthStatus();
  }
}

export default () => createController(AuthController);
