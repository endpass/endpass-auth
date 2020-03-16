<template>
  <code-request
    :challenge-type="challengeType"
    :is-loading.sync="isLoading"
    :error.sync="error"
    :email="email"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import CodeRequest from '@/components/modules/CodeRequest';
import { authStore } from '@/store';
import createAuthController from './AuthController';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'CodeRequestInteractor',

  authController: createAuthController(),
  authStore,

  props: {
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
        switch (err.code) {
          case 409:
            this.error = this.$i18n.t('components.code.userAlreadyExists');
            break;
          default:
            this.error = this.$i18n.t('components.code.authFailed');
        }
      } finally {
        this.isLoading = false;
      }
    },

    onRecover() {
      if (this.isLoading) return;

      this.$emit('recover');
    },
  },

  components: {
    CodeRequest,
  },
};
</script>
