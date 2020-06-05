<template>
  <recorder-state #default="{ isFullScreen, setFullScreen }">
    <recorder-interactor @update:isFullScreen="setFullScreen">
      <recorder-view :is-full-screen="isFullScreen">
        <div @click="onCancel">
          back
        </div>
        <recorder-container />
      </recorder-view>
    </recorder-interactor>
  </recorder-state>
</template>

<script>
import RecorderInteractor from './Recorder.interactor';
import createRecorderController from './Recorder.controller';
import RecorderState from './Recorder.state';
import RecorderView from './Recorder.view';
import RecorderContainer from './Recorder.container';

export default {
  name: 'RecorderInterface',

  recorderController: createRecorderController(),

  provide() {
    const { recorderController } = this.$options;

    return {
      gateway: {
        setFullScreen() {
          recorderController.setFullScreen();
        },

        setNormalScreen() {
          recorderController.setNormalScreen();
        },
      },
    };
  },

  props: {
    documentType: {
      type: String,
      default: '',
    },
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
    RecorderContainer,
    RecorderView,
    RecorderState,
    RecorderInteractor,
  },
};
</script>
