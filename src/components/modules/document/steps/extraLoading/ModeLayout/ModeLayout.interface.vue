<template>
  <mode-layout
    :is-loading="isLoading"
    :is-verified="isVerified"
    @continue="onContinue"
  />
</template>

<script>
import ModeLayout from './ModeLayout.container';

export default {
  name: 'ModeLayoutInterface',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    isVerified: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onContinue() {
      this.$emit('continue');
    },
  },

  components: {
    ModeLayout,
  },
};
</script>
