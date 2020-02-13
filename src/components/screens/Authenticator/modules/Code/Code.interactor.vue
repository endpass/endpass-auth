<template>
  <Code
    :challenge-type="challengeType"
    :is-loading.sync="isLoading"
    :error.sync="error"
    :email="email"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import Code from '@/components/modules/Code';
import { authStore } from '@/store';
import createAuthController from './AuthController';

export default {
  name: 'CodeInteractor',

  authController: createAuthController(),
  authStore,

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

  data: () => ({
    error: '',
    isLoading: false,
  }),

  methods: {
    async onSubmit({ code, isRemember }) {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        const { email, password, isSignUp } = this;

        await this.$options.authController.authWithCode({
          isSignUp,
          email,
          password,
          code,
          isRemember,
        });

        this.$emit('complete');
      } catch (err) {
        this.error = this.$i18n.t('components.code.authFailed');
      } finally {
        this.isLoading = false;
      }
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
