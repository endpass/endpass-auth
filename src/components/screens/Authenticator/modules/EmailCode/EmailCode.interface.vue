<template>
  <email-code
    v-bind="$attrs"
    @auth="onAuth"
  />
</template>

<script>
import EmailCode from './EmailCode.interactor';

export default {
  name: 'EmailCodeInterface',

  methods: {
    onAuth() {
      this.$emit('complete');
    },
  },

  components: {
    EmailCode,
  },
};
</script>
