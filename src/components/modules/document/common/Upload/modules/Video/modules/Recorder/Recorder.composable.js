// @ts-check

import { computed, ref } from '@vue/composition-api';

const MAX_DURATION_SEC = 5;
const TOTAL_DURATION = MAX_DURATION_SEC * 1000;

export const RECORDER_STATE = {
  IDLE: 'IDLE',
  START_RECORD: 'START_RECORD',
  RECORDING: 'RECORDING',
  PLAYING: 'PLAYING',
};
export default function useRecorder() {
  const file = ref(/** @type {File|null} */ (null));
  const secondsLeft = ref(0);
  const recorderState = ref(RECORDER_STATE.IDLE);

  const isPlayAvailable = computed(() => !!file.value);

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
    recorderState.value = RECORDER_STATE.START_RECORD;
    file.value = null;
  };
  const onRecordEnd = () => {
    recorderState.value = RECORDER_STATE.IDLE;
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
    onRecordEnd,
  };
}
