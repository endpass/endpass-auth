<template>
  <timer
    v-if="isLocked"
    :duration="duration"
    @tick="onTick"
    @done="onDone"
  />
</template>

<script>
import Timer from '@/components/common/Timer';

export default {
  name: 'CountDownTimer',

  props: {
    duration: {
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
        return;
      }

      this.startRequestTimer();
    },
  },

  methods: {
    onTick() {
      this.$emit('update:counter', this.counter - 1);
    },

    startRequestTimer() {
      this.$emit('update:is-locked', true);
      const initialCount = Math.floor(this.duration / 1000);
      this.$emit('update:counter', initialCount);
    },

    onDone() {
      this.$emit('update:is-locked', false);
      this.$emit('done');
    },
  },

  components: { Timer },
};
</script>
