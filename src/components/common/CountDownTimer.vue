<template>
  <div />
</template>

<script>
import VueTimers from 'vue-timers/mixin';

export default {
  name: 'CountDownTimer',

  props: {
    timeout: {
      type: Number,
      default: 30000,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    counter: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    isRequestTimerRunning() {
      return this.timers.request.isRunning;
    },
  },

  watch: {
    isLocked(newValue) {
      if (!newValue) {
        this.stopRequestTimer();
        return;
      }

      this.startRequestTimer();
    },
  },

  methods: {
    startRequestTimer() {
      const initialCounter = this.timeout / 1000;

      this.$emit('update:is-locked', true);
      this.$emit('update:counter', initialCounter);
      this.$timer.start('request');
    },

    stopRequestTimer() {
      if (this.isRequestTimerRunning) {
        this.$emit('update:is-locked', false);
        this.$timer.stop('request');
      }
    },

    onRequestTick() {
      if (this.counter === 0) {
        this.stopRequestTimer();
      }

      this.$emit('update:counter', this.counter - 1);
    },
  },

  mixins: [VueTimers],

  timers: {
    request: {
      repeat: true,
      time: 1000,
      callback() {
        this.onRequestTick();
      },
    },
  },
};
</script>
