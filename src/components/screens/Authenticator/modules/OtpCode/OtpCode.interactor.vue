<template>
  <otp-code
    v-bind="$attrs"
    :is-loading="isLoading"
    :error="error"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import OtpCode from '@/components/modules/OtpCode';
import { authStore } from '@/store';
import createAuthController from './AuthController';

export default {
  name: 'OtpCodeInteractor',

  authStore,
  authController: createAuthController(),

  props: {
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
      default: false,
    },
  },

  data: () => ({
    code: '',
    error: null,
    isLoading: false,
  }),

  methods: {
    async onSubmit({ code, isRemember }) {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = null;

        const { email, password, isSignUp } = this;

        await this.$options.authController.authWithCode({
          isSignUp,
          email,
          password,
          code,
          isRemember,
        });

        this.$emit('auth');
      } catch (err) {
        this.error = this.$i18n.t('components.otpBlock.authFailed');
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
    OtpCode,
  },
};
</script>
