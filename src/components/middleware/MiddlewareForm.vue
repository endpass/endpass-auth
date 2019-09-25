<template>
  <v-progress-circle
    v-if="isLoading"
    :progress="25"
  />
  <component
    :is="currentComponent"
    v-else
    @next="onNext"
    @ready="onReady"
    @end="onEnd"
    @cancel="onCancel"
  />
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';

export default {
  name: 'MiddlewareForm',
  props: {
    components: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    index: 0,
    isLoading: true,
  }),

  computed: {
    currentComponent() {
      return this.components[this.index];
    },
  },

  methods: {
    onNext() {
      if (this.components[this.index + 1]) {
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
