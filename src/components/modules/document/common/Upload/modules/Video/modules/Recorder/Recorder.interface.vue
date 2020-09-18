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
import FullScreen from '@/components/modules/FullScreen';
import { PORTAL_NAME } from '@/constants';
import RecorderView from './Recorder.view';

export default {
  name: 'RecorderInterface',

  PORTAL_NAME,

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
