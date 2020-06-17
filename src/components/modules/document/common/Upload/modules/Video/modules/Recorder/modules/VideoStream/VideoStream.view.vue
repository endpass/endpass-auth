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

export default {
  name: 'VideoRecorderView',

  props: {
    file: {
      type: File,
      default: null,
    },

    isPlaying: {
      type: Boolean,
      required: true,
    },

    isRecording: {
      type: Boolean,
      required: true,
    },

    isTimerStarted: {
      type: Boolean,
      required: true,
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

    isPlaying(newVal) {
      if (!this.file) return;
      if (newVal) {
        this.$refs.video.play();
        return;
      }
      this.$refs.video.pause();
    },

    isRecording(newVal) {
      if (!this.recorder) return;
      if (newVal) {
        this.startRecording();
      }
      this.stopRecording();
    },
  },

  methods: {
    async captureMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      return stream;
    },

    async startRecording() {
      await this.initStream();
      await this.initRecorder();

      this.recorder.startRecording();
      this.recorder.camera = this.stream;
      this.$emit('update:is-timer-started', true);
    },

    async stopRecording() {
      if (!this.recorder) return;
      await new Promise(resolve => {
        this.recorder.stopRecording(resolve);
      });

      const blob = await this.recorder.getBlob();
      const now = Date.now();
      const file = new File([blob], `selfie-${now}.avi`, {
        type: blob.type,
      });
      this.dropStream(this.stream);
      this.stream = null;

      this.$emit('update:file', file);
    },

    async initStream() {
      if (this.stream) {
        return;
      }
      const stream = await this.captureMedia();
      if (!this.$refs.video) {
        this.dropStream(stream);
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
        // disableLogs: true,
        mimeType: 'video/webm;codecs=vp8',
      });
    },

    dropStream(stream) {
      if (!stream) return;
      stream.getTracks().forEach(track => track.stop());
    },

    onPlayEnd() {
      this.$emit('update:is-playing', false);
    },
  },

  async mounted() {
    await this.initStream();
    await this.initRecorder();
  },

  beforeDestroy() {
    this.dropStream(this.stream);
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
