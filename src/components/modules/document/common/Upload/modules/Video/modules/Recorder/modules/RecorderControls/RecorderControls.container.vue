<template>
  <component
    :is="currentComponent"
    @continue="onConfirm"
    @retake="onRetake"
  >
    <slot />
  </component>
</template>

<script>
import { computed } from '@vue/composition-api';
import SingleSlot from './modules/SingleSlot';
import MediaRecordDone from './modules/MediaRecordDone';

export default {
  name: 'RecorderControlsContainer',

  props: {
    isPlayAvailable: {
      type: Boolean,
      required: true,
    },
  },

  setup(props) {
    const data = {
      currentComponent: computed(() => {
        switch (true) {
          case !props.isPlayAvailable:
            return SingleSlot;

          case props.isPlayAvailable:
            return MediaRecordDone;

          default:
            throw new Error('Wrong next case with recorder controls');
        }
      }),
    };

    return {
      ...data,
      onRetake() {
        this.$emit('retake');
      },
      onConfirm() {
        this.$emit('confirm');
      },
    };
  },

  components: {
    MediaRecorder,
  },
};
</script>
