<template>
  <div>
    {{ label }}
  </div>
</template>

<script>
export default {
  name: 'CountLabel',

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
