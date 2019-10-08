import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import permissionsService from '@/service/permissions';

@Module({ generateMutationSetters: true })
class LoginController extends VuexModule {
  challengeId = '';

  constructor(props, { challengeId }) {
    super(props);
    this.challengeId = challengeId;
  }

  @Action
  async authWithCode({ code }) {
    const { redirect } = await permissionsService.login({
      challengeId: this.challengeId,
      code,
    });
    window.location.href = redirect;
  }
}

export default params => createController(LoginController, params);
