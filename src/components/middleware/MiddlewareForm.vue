<template>
  <div>
    <v-progress-circle
      v-if="isLoading"
      :progress="25"
    />
    <component
      :is="currentStep"
      v-show="!isLoading"
      @next="onNext"
      @ready="onReady"
      @end="onEnd"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';

export default {
  name: 'MiddlewareForm',
  props: {
    steps: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    index: 0,
    isLoading: true,
  }),

  computed: {
    currentStep() {
      return this.steps[this.index];
    },
  },

  methods: {
    onNext() {
      if (this.steps[this.index + 1]) {
        this.$emit('end');
        return;
      }
      this.isLoading = true;
      this.index += 1;
    },
    onEnd() {
      this.$emit('end');
    },
    onCancel() {
      this.$emit('cancel');
    },
    onReady() {
      this.isLoading = false;
    },
  },
  components: { VProgressCircle },
};
</script>
