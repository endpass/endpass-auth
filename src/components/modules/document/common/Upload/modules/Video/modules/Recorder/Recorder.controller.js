// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';

import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

@Module({ generateMutationSetters: true })
class RecorderController extends VuexModule {
  isFullScreen = false;

  @Action
  async setFullScreen() {
    this.isFullScreen = true;
    bridgeMessenger.send(METHODS.DIALOG_RESIZE, {
      isFullScreen: true,
    });
  }

  @Action
  async setNormalScreen() {
    this.isFullScreen = false;
    bridgeMessenger.send(METHODS.DIALOG_RESIZE, {
      isFullScreen: false,
    });
  }
}

export default () => createController(RecorderController);
