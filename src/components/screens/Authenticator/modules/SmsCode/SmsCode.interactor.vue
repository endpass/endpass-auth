<template>
  <sms-code
    v-bind="$attrs"
    :is-loading="isLoading"
    :error="error"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import SmsCode from '@/components/modules/code/SmsCode';
import { authStore } from '@/store';
import createAuthController from './AuthController';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'SmsCodeInteractor',

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
          challengeType: CHALLENGE_TYPES.SMS_OTP,
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

    async sendCode() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = null;

        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.error = this.$i18n.t('components.emailCode.sendError');
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.sendCode();
  },

  components: {
    SmsCode,
  },
};
</script>
