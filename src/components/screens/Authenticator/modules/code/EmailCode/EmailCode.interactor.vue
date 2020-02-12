<template>
  <email-code
    v-bind="$attrs"
    :is-loading="isLoading"
    :error="error"
    :email="email"
    @send-code="sendCode"
    @submit="onSubmit"
  />
</template>

<script>
import EmailCode from '@/components/modules/code/EmailCode';
import { authStore } from '@/store';
import createAuthController from '../AuthController';

export default {
  name: 'EmailCodeInteractor',

  authController: createAuthController(),
  authStore,

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
    EmailCode,
  },
};
</script>
