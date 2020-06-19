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
import { RECORDER_STATE } from '../../Recorder.composable';

export default {
  name: 'RecorderControlsContainer',

  props: {
    recorderState: {
      type: String,
      default: RECORDER_STATE.IDLE,
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
          case props.recorderState === RECORDER_STATE.IDLE &&
            !props.isPlayAvailable:
            return MediaRecorder;

          case props.recorderState === RECORDER_STATE.START_RECORD:
          case props.recorderState === RECORDER_STATE.RECORDING:
            return MediaTimer;

          case props.recorderState === RECORDER_STATE.PLAYING:
            return MediaPause;

          case props.recorderState === RECORDER_STATE.IDLE &&
            props.isPlayAvailable:
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
