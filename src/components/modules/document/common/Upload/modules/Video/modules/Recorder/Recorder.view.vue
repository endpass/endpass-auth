<template>
  <div class="recorder-view">
    <div class="recorder-view-container">
      <div>
        <button
          class="recorder-view-button-back"
          data-test="back-button"
          @click="onBack"
        >
          <v-svg-icon
            name="arrow-left"
            width="23px"
            height="17px"
          />
        </button>
        <div class="recorder-view-title">
          {{ $t('components.uploadVideo.recorder.title') }}
        </div>
      </div>
      <div class="recorder-view-video">
        <video-stream
          :recorder-state.sync="recorderState"
          :file.sync="file"
          class="recorder-video-stream"
          @error="onStreamError"
        />
        <div
          v-if="!!errorMessage"
          class="recorder-view-error"
        >
          {{ errorMessage }}
        </div>
      </div>
      <div class="recorder-view-controls">
        <recorder-controls
          :is-play-available="isPlayAvailable"
          @confirm="onConfirm"
          @retake="onStartRecord"
        >
          <record-button
            :recorder-state="recorderState"
            :seconds-left="secondsLeft"
            :seconds-total="MAX_DURATION_SEC"
            :is-disabled="!!errorMessage"
            @record="onStartRecord"
            @play="onPlay"
          />
        </recorder-controls>
        <count-down-timer
          :duration="TOTAL_DURATION"
          :is-counting="isTimerCounting"
          :counter.sync="secondsLeft"
          @done="stopRecording"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import RecorderControls from './modules/RecorderControls';
import CountDownTimer from '@/components/common/CountDownTimer';
import VideoStream from './modules/VideoStream';
import RecordButton from './modules/RecordButton';
import useRecorder from './Recorder.composable';

export default {
  name: 'RecorderView',

  props: {
    temp: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, context) {
    const { file, ...recorder } = useRecorder();

    const onConfirm = () => context.emit('confirm', file.value);
    const onBack = () => context.emit('cancel');

    return {
      ...recorder,
      file,

      onConfirm,
      onBack,
    };
  },

  methods: {
    onStreamError(errorMessage) {
      this.errorMessage = errorMessage;
    },
  },

  components: {
    VideoStream,
    CountDownTimer,
    RecorderControls,
    VSvgIcon,
    RecordButton,
  },
};
</script>

<style lang="postcss">
.recorder-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.recorder-view-container {
  display: flex;
  flex-direction: column;
  max-width: 853px;
  max-height: 480px;
  width: 100%;
  height: 100%;
  position: relative;
}

.recorder-view-title {
  text-align: center;
  margin: 10px 100px;
  font-size: 20px;
  color: var(--endpass-ui-color-white);
}

.recorder-view-video {
  flex: 1;
  max-width: 853px;
  max-height: 480px;
  width: 100%;
  height: 100%;
  background-color: var(--endpass-ui-color-grey-9);
  overflow: hidden;
  position: relative;
}

.recorder-video-stream {
  width: 100%;
  height: 100%;
}

.recorder-view-controls {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.recorder-view-button-back {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--endpass-ui-color-grey-5);
  background: none;
  border: 0;
  cursor: pointer;
  display: flex;
  padding: 0;
  outline: 0;
  user-select: none;
  margin: 10px;
}

.recorder-view-error {
  position: absolute;
  font-size: 30px;
  color: var(--endpass-ui-color-white);
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  text-align: center;
}
</style>
