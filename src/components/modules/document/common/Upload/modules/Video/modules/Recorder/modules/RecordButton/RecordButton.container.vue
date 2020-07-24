<template>
  <component
    :is="currentComponent"
    :seconds-left="secondsLeft"
    :seconds-total="secondsTotal"
    :is-disabled="isDisabled"
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
  name: 'RecordButtonContainer',

  props: {
    recorderState: {
      type: String,
      default: RECORDER_STATE.IDLE,
    },

    secondsLeft: {
      type: Number,
      required: true,
    },

    secondsTotal: {
      type: Number,
      required: true,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const computedData = {
      currentComponent: computed(() => {
        switch (true) {
          case props.recorderState === RECORDER_STATE.IDLE:
            return MediaRecorder;

          case props.recorderState === RECORDER_STATE.INITIALIZING:
          case props.recorderState === RECORDER_STATE.RECORDING:
            return MediaTimer;

          case props.recorderState === RECORDER_STATE.PLAYING:
            return MediaPause;

          case props.recorderState === RECORDER_STATE.IDLE_FOR_PLAY:
            return MediaPlay;

          default:
            throw new Error('Wrong next case with playback button');
        }
      }),
    };

    return {
      ...computedData,

      onRecord() {
        context.emit('record');
      },
      onPlay() {
        context.emit('play');
      },
      onPause() {
        context.emit('pause');
      },
    };
  },

  components: {
    MediaRecorder,
  },
};
</script>
