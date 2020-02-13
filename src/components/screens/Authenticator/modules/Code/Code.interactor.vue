<template>
  <Code
    :challenge-type="challengeType"
    :is-loading="isLoading"
    :error="error"
    :email="email"
    @recover="onRecover"
    @send-code="sendCode"
    @submit="onSubmit"
  />
</template>

<script>
import Code from '@/components/modules/Code';
import { authStore } from '@/store';
import createAuthController from './AuthController';
import { CHALLENGE_TYPES } from '@/constants';

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

    async sendCode() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.error = this.$i18n.t('components.code.sendError');
      } finally {
        this.isLoading = false;
      }
    },

    onRecover() {
      if (this.isLoading) return;

      this.$emit('recover');
    },
  },

  mounted() {
    if (this.challengeType === CHALLENGE_TYPES.APP_OTP) {
      return;
    }

    this.sendCode();
  },

  components: {
    Code,
  },
};
</script>
