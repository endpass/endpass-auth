<template>
  <full-screen-state #default="{ isFullScreen, setFullScreen }">
    <full-screen-interactor @update:isFullScreen="setFullScreen">
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

  methods: {
    onConfirm(document) {
      this.$emit('confirm', document);
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    FullScreenView,
    FullScreenState,
    FullScreenInteractor,
  },
};
</script>
