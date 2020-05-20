import { VuexModule, Module, Action } from 'vuex-class-modules';
import riskScoringService from '@/service/riskScoring';

@Module({ generateMutationSetters: true })
class RiskScoringModule extends VuexModule {
  /**
   * @return {Promise<void>}
   */
  @Action
  async sendFingerprint() {
    await riskScoringService.sendFingerprint();
  }
}

export default RiskScoringModule;
