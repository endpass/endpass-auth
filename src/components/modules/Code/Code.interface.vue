<template>
  <Code
    :challenge-type="challengeType"
    :is-loading="isLoading"
    :email="email"
    :error="error"
    @send-code="onSendCode"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import Code from './Code.container';

export default {
  name: 'CodeInterface',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
    },

    challengeType: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
  },

  methods: {
    onSendCode() {
      this.$emit('send-code');
    },

    onRecover() {
      this.$emit('recover');
    },

    onSubmit({ code }) {
      this.$emit('submit', { code });
    },
  },

  components: {
    Code,
  },
};
</script>
