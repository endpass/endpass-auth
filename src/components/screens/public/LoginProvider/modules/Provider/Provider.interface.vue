<template>
  <provider
    :email="email"
    :error="error"
    :is-loading="isLoading"
    :challenge-type="challengeType"
    :oauth-login-challenge="oauthLoginChallenge"
    :is-closable="isClosable"
    @complete="onComplete"
    @close="onClose"
  />
</template>

<script>
import { CHALLENGE_TYPES } from '@/constants';
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

    isClosable: {
      type: Boolean,
      default: false,
    },

    oauthLoginChallenge: {
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
      validator(value) {
        return Object.keys(CHALLENGE_TYPES).includes(value);
      },
    },
  },

  methods: {
    onComplete({ redirect }) {
      this.$emit('complete', { redirect });
    },

    onClose() {
      this.$emit('close');
    },
  },

  components: {
    Provider,
  },
};
</script>
