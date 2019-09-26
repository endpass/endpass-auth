import { VuexModule, Module, Mutation } from 'vuex-class-modules';

@Module({ generateMutationSetters: true })
class SharedModule extends VuexModule {
  // old this.loading from core
  isLoading = false;

  @Mutation
  changeLoadingStatus(value) {
    this.isLoading = value;
  }
}

export default SharedModule;
