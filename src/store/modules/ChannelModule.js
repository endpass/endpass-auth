// @ts-check
import { VuexModule, Module, Mutation } from 'vuex-class-modules';

@Module({ generateMutationSetters: true })
class ChannelModule extends VuexModule {
  /**
   * @type {object}
   */
  payload = {};

  /**
   * @param {object} value
   */
  @Mutation
  setPayload(value) {
    this.payload = value || {};
  }
}

export default ChannelModule;
