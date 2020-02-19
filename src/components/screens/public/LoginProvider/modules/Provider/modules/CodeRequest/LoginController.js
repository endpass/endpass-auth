import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import permissionsService from '@/service/permissions';

@Module({ generateMutationSetters: true })
class LoginController extends VuexModule {
  @Action
  async authLoginChallenge({ challengeId, code }) {
    const data = await permissionsService.login({
      challengeId,
      code,
    });

    return data;
  }
}

export default params => createController(LoginController, params);
