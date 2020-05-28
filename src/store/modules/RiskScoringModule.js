import { VuexModule, Module, Action } from 'vuex-class-modules';
import riskScoringService from '@/service/riskScoring';

@Module({ generateMutationSetters: true })
class RiskScoringModule extends VuexModule {
  /**
   * @return {Promise<void>}
   */
  @Action
  async sendUserMetrics() {
    await riskScoringService.sendUserMetrics();
  }
}

export default RiskScoringModule;
