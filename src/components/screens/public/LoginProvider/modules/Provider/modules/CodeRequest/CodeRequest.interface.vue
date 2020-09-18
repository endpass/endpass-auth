<template>
  <code-request
    :challenge-type="challengeType"
    :email="email"
    :oauth-login-challenge="oauthLoginChallenge"
    @complete="onComplete"
    @recover="onRecover"
  />
</template>

<script>
import { CHALLENGE_TYPES } from '@/constants';
import CodeRequest from './CodeRequest.interactor';

export default {
  name: 'CodeRequestInterface',

  props: {
    challengeType: {
      type: String,
      required: true,
      validator(value) {
        return Object.keys(CHALLENGE_TYPES).includes(value);
      },
    },

    oauthLoginChallenge: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      required: true,
    },
  },

  methods: {
    onComplete({ redirect }) {
      this.$emit('complete', { redirect });
    },

    onRecover() {
      this.$emit('recover');
    },
  },

  components: {
    CodeRequest,
  },
};
</script>
