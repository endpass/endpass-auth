<template>
  <code-request
    :challenge-type="challengeType"
    :email="email"
    :login-challenge="loginChallenge"
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

    loginChallenge: {
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
