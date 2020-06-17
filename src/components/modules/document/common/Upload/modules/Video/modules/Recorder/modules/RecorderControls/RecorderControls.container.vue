<template>
  <component
    :is="currentComponent"
    @confirm="onConfirm"
    @retake="onRetake"
  >
    <slot />
  </component>
</template>

<script>
import { computed } from '@vue/composition-api';
import WrapperSlot from './modules/WrapperSlot';
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
            return WrapperSlot;

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
};
</script>
