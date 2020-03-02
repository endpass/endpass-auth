import { VuexModule, Module, Mutation } from 'vuex-class-modules';

@Module({ generateMutationSetters: true })
class ChannelModule extends VuexModule {
  payload = {};

  @Mutation
  setPayload(value) {
    this.payload = value;
  }
}

export default ChannelModule;
