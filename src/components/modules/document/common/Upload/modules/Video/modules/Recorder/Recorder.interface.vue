<template>
  <recorder-state>
    <recorder-interactor>
      <recorder-view
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </recorder-interactor>
  </recorder-state>
</template>

<script>
import RecorderInteractor from './Recorder.interactor';
import createRecorderController from './Recorder.controller';
import RecorderState from './Recorder.state';
import RecorderView from './Recorder.view';

export default {
  name: 'RecorderInterface',

  recorderController: createRecorderController(),

  provide() {
    // const { recorderController } = this.$options;

    return {
      gateway: {},
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
    RecorderView,
    RecorderState,
    RecorderInteractor,
  },
};
</script>
