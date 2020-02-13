<template>
  <Code
    :challenge-type="challengeType"
    :email="email"
    :password="password"
    :is-sign-up="isSignUp"
    @auth="onAuth"
    @recover="onRecover"
  />
</template>

<script>
import Code from './Code.interactor';

export default {
  name: 'CodeInterface',

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
      default: false,
    },
  },

  methods: {
    onAuth() {
      this.$emit('complete');
    },

    onRecover() {
      this.$emit('recover');
    },
  },

  components: {
    Code,
  },
};
</script>
