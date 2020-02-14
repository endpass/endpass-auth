<template>
  <provider
    :email="email"
    :error="error"
    :is-loading="isLoading"
    :challenge-type="challengeType"
    :login-challenge="loginChallenge"
    @complete="onComplete"
  />
</template>

<script>
import Provider from './Provider.container';

export default {
  name: 'ProviderInterface',

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
    Provider,
  },
};
</script>
