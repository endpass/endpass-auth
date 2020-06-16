<template>
  <div>
    <video
      ref="video"
      autoplay
      muted
      playsinline
      class="recorder-view-video"
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
      this.dropStream();

      this.$emit('update:file', file);
    },

    async initStream() {
      if (this.stream) {
        return;
      }
      this.stream = await this.captureMedia();
      this.$refs.video.src = null;
      this.$refs.video.srcObject = this.stream;
    },

    async initRecorder() {
      if (this.recorder) {
        this.recorder.destroy();
      }
      this.recorder = new RecordRTC(this.stream, {
        type: 'video/webm;codecs=h264',
        disableLogs: true,
        mimeType: 'video/webm',
      });
    },

    dropStream() {
      if (!this.stream) return;
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    },

    onPlayEnd() {
      this.$emit('update:is-playing', false);
    },
  },

  async mounted() {
    await this.initStream();
    await this.initRecorder();
    this.$refs.video.addEventListener('ended', this.onPlayEnd);
  },

  beforeDestroy() {
    this.dropStream();
    this.$refs.video.removeEventListener('ended', this.onPlayEnd);
    if (!this.recorder) return;
    this.recorder.destroy();
  },
};
</script>

<style lang="postcss"></style>
