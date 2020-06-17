<template>
  <div class="recorder-view">
    <div class="recorder-view-container">
      <div>
        <button
          class="recorder-view-button-back"
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
          :is-recording="isRecording"
          :is-playing.sync="isPlaying"
          :file.sync="file"
          :is-timer-started.sync="isTimerStarted"
          class="recorder-video-stream"
        />
      </div>
      <div class="recorder-view-controls">
        <recorder-controls
          :is-play-available="isPlayAvailable"
          @confirm="onConfirm"
          @retake="onRecord"
        >
          <record-button
            :is-recording="isRecording"
            :is-playing="isPlaying"
            :is-play-available="isPlayAvailable"
            :seconds-left="secondsLeft"
            :seconds-total="MAX_DURATION_SEC"
            @record="onRecord"
            @play="onPlay"
          />
        </recorder-controls>
        <count-down-timer
          :duration="TOTAL_DURATION"
          :is-locked="isTimerStarted"
          :counter.sync="secondsLeft"
          @done="onRecordEnd"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import RecorderControls from './modules/RecorderControls';
import CountDownTimer from '@/components/common/CountDownTimer';
import VideoStream from './modules/VideoStream';
import RecordButton from './modules/RecordButton';

const MAX_DURATION_SEC = 5;
const TOTAL_DURATION = MAX_DURATION_SEC * 1000;

export default {
  name: 'RecorderView',

  setup() {
    const data = {
      file: ref(null),
      secondsLeft: ref(0),
      isTimerStarted: ref(false),
      isRecording: ref(false),
      isPlaying: ref(false),
    };

    const isPlayAvailable = computed(() => !!data.file.value);

    return {
      ...data,
      isPlayAvailable,

      TOTAL_DURATION,
      MAX_DURATION_SEC,

      onPause() {
        data.isPlaying.value = false;
      },
      onPlay() {
        data.isPlaying.value = true;
      },
      onRecord() {
        data.file.value = null;
        data.isPlaying.value = false;
        data.isRecording.value = true;
      },
      onRecordEnd() {
        data.isRecording.value = false;
        data.isTimerStarted.value = false;
      },
      onConfirm() {
        this.$emit('confirm', data.file.value);
      },
      onBack() {
        this.$emit('cancel');
      },
    };
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
</style>
