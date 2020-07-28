// @ts-check

import { computed, ref } from '@vue/composition-api';

const MAX_DURATION_SEC = 5;
const TOTAL_DURATION = MAX_DURATION_SEC * 1000;

export const RECORDER_STATE = {
  IDLE: 'IDLE',
  INITIALIZING: 'INITIALIZING',
  RECORDING: 'RECORDING',
  PLAYING: 'PLAYING',
  IDLE_FOR_PLAY: 'IDLE_FOR_PLAY',
};

export default function useRecorder() {
  const file = ref(/** @type {File|null} */ (null));
  const secondsLeft = ref(0);
  const recorderState = ref(RECORDER_STATE.IDLE);
  const errorMessage = ref(/** @type {string|null} */ (null));

  const isPlayAvailable = computed(
    () => recorderState.value === RECORDER_STATE.IDLE_FOR_PLAY,
  );

  const isTimerCounting = computed(
    () => recorderState.value === RECORDER_STATE.RECORDING,
  );
  const onPause = () => {
    recorderState.value = RECORDER_STATE.IDLE;
  };
  const onPlay = () => {
    recorderState.value = RECORDER_STATE.PLAYING;
  };

  const onStartRecord = () => {
    recorderState.value = RECORDER_STATE.INITIALIZING;
    file.value = null;
  };
  const stopRecording = () => {
    recorderState.value = RECORDER_STATE.IDLE;
  };

  /**
   * @param {string} newErrorMessage
   */
  const onStreamError = newErrorMessage => {
    errorMessage.value = newErrorMessage;
  };

  return {
    file,
    recorderState,
    isPlayAvailable,
    secondsLeft,
    isTimerCounting,

    TOTAL_DURATION,
    MAX_DURATION_SEC,

    onPause,
    onPlay,
    onStartRecord,
    stopRecording,

    errorMessage,
    onStreamError,
  };
}
