<template>
  <extra-loading @done="onDone" />
</template>

<script>
import ExtraLoading from './ExtraLoading.view';

export default {
  name: 'ExtraLoadingInterface',

  methods: {
    onDone() {
      this.$emit('timeout');
    },
  },

  components: {
    ExtraLoading,
  },
};
</script>
