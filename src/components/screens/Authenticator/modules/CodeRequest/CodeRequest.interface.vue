<template>
  <code-request
    :challenge-type="challengeType"
    :email="email"
    :password="password"
    :is-sign-up="isSignUp"
    @complete="onComplete"
    @recover="onRecover"
  />
</template>

<script>
import CodeRequest from './CodeRequest.interactor';

export default {
  name: 'CodeRequestInterface',

  props: {
    challengeType: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isSignUp: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onComplete() {
      this.$emit('complete');
    },

    onRecover() {
      this.$emit('switch', { to: 'recovery-code' });
    },
  },

  components: {
    CodeRequest,
  },
};
</script>
