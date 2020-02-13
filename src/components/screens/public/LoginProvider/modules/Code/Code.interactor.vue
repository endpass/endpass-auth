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
import createLoginController from './LoginController';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'CodeInteractor',

  loginController: createLoginController(),
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
  },

  data: () => ({
    error: null,
    isLoading: false,
  }),

  methods: {
    async onSubmit({ code }) {
      try {
        this.isLoading = true;
        const {
          redirect,
        } = await this.$options.loginController.authLoginChallenge({
          challengeId: this.loginChallenge,
          code,
        });
        this.$emit('complete', { redirect });
      } catch (e) {
        this.error = this.$i18n.t('components.loginProvider.notWorkingError');
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
    if (this.challengeType === CHALLENGE_TYPES.EMAIL_OTP) {
      return;
    }

    this.sendCode();
  },

  components: {
    Code,
  },
};
</script>
