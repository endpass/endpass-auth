<template>
  <code-request
    :challenge-type="challengeType"
    :email="email"
    :is-loading="isLoading"
    :error="error"
    @recover="onRecover"
    @submit="onSubmit"
    @update="onUpdate"
  />
</template>

<script>
import { CHALLENGE_TYPES } from '@/constants';
import CodeRequest from './CodeRequest.interactor';

export default {
  name: 'CodeRequestInterface',

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

    onSubmit({ code, isRemember }) {
      this.$emit('submit', { code, isRemember });
    },

    onUpdate({ isLoading = this.isLoading, error = this.error }) {
      this.$emit('update:is-loading', isLoading);
      this.$emit('update:error', error);
    },
  },

  components: {
    CodeRequest,
  },
};
</script>
