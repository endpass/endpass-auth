<template>
  <full-screen-state #default="{ isFullScreen, updateState }">
    <full-screen-interactor @update="updateState">
      <full-screen-view :is-full-screen="isFullScreen">
        <slot />
      </full-screen-view>
    </full-screen-interactor>
  </full-screen-state>
</template>

<script>
import FullScreenInteractor from './FullScreen.interactor';
import createFullScreenController from './FullScreen.controller';
import FullScreenState from './FullScreen.state';
import FullScreenView from './FullScreen.view';

export default {
  name: 'FullScreenInterface',

  fullScreenController: createFullScreenController(),

  provide() {
    const { fullScreenController } = this.$options;

    return {
      gateway: {
        setFullScreen() {
          fullScreenController.setFullScreen();
        },

        setNormalScreen() {
          fullScreenController.setNormalScreen();
        },
      },
    };
  },

  components: {
    FullScreenView,
    FullScreenState,
    FullScreenInteractor,
  },
};
</script>
