<template>
  <success @create="onCreate" />
</template>

<script>
import Success from './Success.view';

export default {
  name: 'SuccessInterface',

  methods: {
    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    Success,
  },
};
</script>
