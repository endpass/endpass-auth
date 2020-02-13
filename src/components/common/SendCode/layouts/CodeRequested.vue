<template>
  <div>
    {{ label }}
  </div>
</template>

<script>
export default {
  name: 'CodeRequested',

  props: {
    counter: {
      type: Number,
      required: true,
    },
  },

  computed: {
    label() {
      return this.$t('components.sendCode.youCanRequestCodeAfter', {
        seconds: this.counter,
      });
    },
  },
};
</script>
