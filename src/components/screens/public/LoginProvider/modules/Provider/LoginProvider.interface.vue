<template>
  <login-provider
    :email="email"
    :error="error"
    :is-loading="isLoading"
    :challenge-type="challengeType"
    :login-challenge="loginChallenge"
    @complete="onComplete"
  />
</template>

<script>
import LoginProvider from './LoginProvider.container';

export default {
  name: 'LoginProviderInterface',

  props: {
    error: {
      type: String,
      default: '',
    },

    isLoading: {
      type: Boolean,
      required: true,
    },

    loginChallenge: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      default: '',
    },

    challengeType: {
      type: String,
      required: true,
    },
  },

  methods: {
    onComplete({ redirect }) {
      this.$emit('compete', { redirect });
    },
  },

  components: {
    LoginProvider,
  },
};
</script>
