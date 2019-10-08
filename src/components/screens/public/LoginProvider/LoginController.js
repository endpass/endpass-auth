import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import permissionsService from '@/service/permissions';

@Module({ generateMutationSetters: true })
class LoginController extends VuexModule {
  @Action
  async authWithCode({ challengeId, code }) {
    const { redirect } = await permissionsService.login({
      challengeId,
      code,
    });
    window.location.href = redirect;
  }
}

export default params => createController(LoginController, params);
