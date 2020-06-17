<template>
  <portal :to="$options.PORTAL_NAME">
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
import { PORTAL_NAME } from '@/constants';

export default {
  name: 'RecorderInterface',

  PORTAL_NAME,

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
