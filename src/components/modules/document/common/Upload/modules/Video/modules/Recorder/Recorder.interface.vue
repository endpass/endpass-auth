<template>
  <portal to="portal-layout">
    <full-screen>
      <recorder-view
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </full-screen>
  </portal>
</template>

<script>
import RecorderView from './Recorder.view';
import FullScreen from '@/components/modules/FullScreen';

export default {
  name: 'RecorderInterface',

  props: {
    documentType: {
      type: String,
      default: '',
    },
  },

  methods: {
    onConfirm(recordedFile) {
      this.$emit('next', {
        recordedFile,
      });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    FullScreen,
    RecorderView,
  },
};
</script>
