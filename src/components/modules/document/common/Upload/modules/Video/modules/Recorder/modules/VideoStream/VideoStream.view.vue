<template>
  <div class="video-stream">
    <video
      ref="video"
      autoplay
      muted
      playsinline
      class="video-stream-place"
      @ended="onPlayEnd"
    />
  </div>
</template>

<script>
import RecordRTC from 'recordrtc';
import { RECORDER_STATE } from '../../Recorder.composable';

export default {
  name: 'VideoRecorderView',

  props: {
    file: {
      type: File,
      default: null,
    },

    recorderState: {
      type: String,
      default: RECORDER_STATE.IDLE,
    },
  },

  data: () => ({
    stream: null,
  }),

  watch: {
    file(newVal) {
      if (!newVal) {
        this.$refs.video.srcObject = null;
        this.$refs.video.src = null;
        return;
      }
      const objectUrl = URL.createObjectURL(newVal);
      this.$refs.video.srcObject = null;
      this.$refs.video.src = objectUrl;
      this.$refs.video.pause();
    },

    recorderState(newState, oldState) {
      switch (oldState) {
        case RECORDER_STATE.PLAYING:
          this.stopPlay();
          break;
        case RECORDER_STATE.RECORDING:
          this.stopRecording();
          break;
        default:
          break;
      }

      switch (newState) {
        case RECORDER_STATE.PLAYING:
          this.startPlay();
          break;
        case RECORDER_STATE.INITIALIZING:
          if (this.recorder) this.startRecording();
          break;

        default:
          break;
      }

      this.$emit('error', null);
    },
  },

  methods: {
    // eslint-disable-next-line consistent-return
    async captureMedia() {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        return stream;
      } catch (err) {
        let errorMessage;

        switch (err.name) {
          case 'NotAllowedError':
            errorMessage = this.$t(
              'components.uploadVideo.recorder.errors.cameraNotAllowed',
            );
            break;

          case 'NotFoundError':
            errorMessage = this.$t(
              'components.uploadVideo.recorder.errors.cameraNotFound',
            );
            break;

          default:
            errorMessage = this.$t(
              'components.uploadVideo.recorder.errors.default',
            );
            break;
        }

        this.$emit('update:recorder-state', RECORDER_STATE.IDLE);
        await this.$nextTick(() => this.$emit('error', errorMessage));
      }
    },

    startPlay() {
      if (!this.file) return;
      this.$refs.video.play();
    },

    stopPlay() {
      this.$refs.video.pause();
    },

    async startRecording() {
      await this.openStream();
      await this.initRecorder();

      this.recorder.startRecording();
      this.recorder.camera = this.stream;
      this.$emit('update:recorder-state', RECORDER_STATE.RECORDING);
    },

    async stopRecording() {
      if (!this.recorder) return;
      await new Promise(resolve => {
        if (this.stream.active) {
          this.recorder.stopRecording(resolve);
          return;
        }

        resolve();
      });

      const blob = await this.recorder.getBlob();
      const now = Date.now();
      const file = new File([blob], `selfie-${now}.avi`, {
        type: blob.type,
      });
      this.closeStream(this.stream);
      this.stream = null;

      this.$emit('update:file', file);
      this.$emit('update:recorder-state', RECORDER_STATE.IDLE_FOR_PLAY);
    },

    async openStream() {
      if (this.stream && this.stream.active) {
        return;
      }
      const stream = await this.captureMedia();
      if (!this.$refs.video) {
        this.closeStream(stream);
        return;
      }

      this.stream = stream;
      this.$refs.video.src = null;
      this.$refs.video.srcObject = this.stream;
    },

    async initRecorder() {
      if (this.recorder) {
        this.recorder.destroy();
      }
      if (!this.stream) return;

      this.recorder = new RecordRTC(this.stream, {
        type: 'video',
        disableLogs: true,
        mimeType: 'video/webm;codecs=vp8',
      });
    },

    closeStream(stream) {
      if (!stream) return;
      stream.getTracks().forEach(track => track.stop());
    },

    async onPlayEnd() {
      if (this.stream && !this.stream.active) {
        this.$emit('update:recorder-state', RECORDER_STATE.INITIALIZING);

        await this.openStream();
      } else {
        this.$emit('update:recorder-state', RECORDER_STATE.IDLE_FOR_PLAY);
      }
    },
  },

  async mounted() {
    await this.openStream();
    await this.initRecorder();

    if (this.recorderState === RECORDER_STATE.INITIALIZING) {
      await this.startRecording();
    }
  },

  beforeDestroy() {
    this.closeStream(this.stream);
    this.stream = null;
    if (!this.recorder) return;
    this.recorder.destroy();
    this.recorder = null;
  },
};
</script>

<style lang="postcss">
.video-stream {
  display: flex;
  justify-content: center;
}
.video-stream-place {
  flex: 1;
  max-height: 100%;
}
</style>
