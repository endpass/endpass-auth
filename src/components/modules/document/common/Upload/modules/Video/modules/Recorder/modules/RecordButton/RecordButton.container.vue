<template>
  <component
    :is="currentComponent"
    :seconds-left="secondsLeft"
    :seconds-total="secondsTotal"
    @record="onRecord"
    @play="onPlay"
    @pause="onPause"
  >
    <slot />
  </component>
</template>

<script>
import { computed } from '@vue/composition-api';
import MediaRecorder from './modules/MediaRecord';
import MediaPlay from './modules/MediaPlay';
import MediaPause from './modules/MediaPause';
import MediaTimer from './modules/MediaTimer';

export default {
  name: 'RecorderControlsContainer',

  props: {
    isRecording: {
      type: Boolean,
      required: true,
    },

    isPlaying: {
      type: Boolean,
      required: true,
    },

    isPlayAvailable: {
      type: Boolean,
      required: true,
    },

    secondsLeft: {
      type: Number,
      required: true,
    },

    secondsTotal: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const computedData = {
      currentComponent: computed(() => {
        switch (true) {
          case !props.isRecording && !props.isPlayAvailable:
            return MediaRecorder;

          case props.isRecording:
            return MediaTimer;

          case props.isPlaying:
            return MediaPause;

          case !props.isPlaying && props.isPlayAvailable:
            return MediaPlay;

          default:
            throw new Error('Wrong next case with playback button');
        }
      }),
    };

    return {
      ...computedData,

      onRecord() {
        this.$emit('record');
      },
      onPlay() {
        this.$emit('play');
      },
      onPause() {
        this.$emit('pause');
      },
    };
  },

  components: {
    MediaRecorder,
  },
};
</script>
