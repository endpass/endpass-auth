<template>
  <success @done="onDone" />
</template>

<script>
import Success from './Success.view';

export default {
  name: 'SuccessInterface',

  method: {
    onDone() {},
  },

  components: {
    Success,
  },
};
</script>
