import { VuexModule, Module, Mutation } from 'vuex-class-modules';

@Module({ generateMutationSetters: true })
class SharedModule extends VuexModule {
  isLoading = false; // old this.loading from core

  @Mutation
  changeLoadingStatus(value) {
    this.isLoading = value;
  }
}

export default SharedModule;
