<template>
  <Code
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
import Code from './Code.interactor';

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
    onRecover() {
      this.$emit('recover');
    },

    onSubmit({ code }) {
      this.$emit('submit', { code });
    },

    onUpdate({ isLoading = this.isLoading, error = this.error }) {
      this.$emit('update:is-loading', isLoading);
      this.$emit('update:error', error);
    },
  },

  components: {
    Code,
  },
};
</script>
