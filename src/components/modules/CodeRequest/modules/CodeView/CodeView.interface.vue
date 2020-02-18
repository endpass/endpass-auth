<template>
  <code-view
    :challenge-type="challengeType"
    :email="email"
    :is-loading="isLoading"
    :error="error"
    @send-code="onSendCode"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import CodeView from './CodeView.container';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'CodeViewInterface',

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
      validator(value) {
        return Object.keys(CHALLENGE_TYPES).includes(value);
      },
    },

    email: {
      type: String,
      required: true,
    },
  },

  methods: {
    onRecover() {
      this.$emit('recover');
    },

    onSubmit({ code }) {
      this.$emit('submit', { code });
    },

    onSendCode() {
      this.$emit('send-code');
    },
  },

  components: {
    CodeView,
  },
};
</script>
