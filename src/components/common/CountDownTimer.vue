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
      this.$timer.start('counter');
    },

    stopRequestTimer() {
      if (!this.timers.counter.isRunning) {
        return;
      }

      this.$emit('update:is-locked', false);
      this.$timer.stop('counter');
    },

    onRequestTick() {
      const nextCounterValue = this.counter - 1;

      this.$emit('update:counter', nextCounterValue);

      if (nextCounterValue === 0) {
        this.stopRequestTimer();
      }
    },
  },

  mixins: [VueTimers],

  timers: {
    counter: {
      repeat: true,
      time: 1000,
      callback() {
        this.onRequestTick();
      },
    },
  },
};
</script>
