<template>
  <continue @continue="onContinue" />
</template>
<script>
import Continue from './Continue.view';

export default {
  name: 'ContinueInterface',

  methods: {
    onContinue() {
      this.$emit('continue');
    },
  },

  components: {
    Continue,
  },
};
</script>
