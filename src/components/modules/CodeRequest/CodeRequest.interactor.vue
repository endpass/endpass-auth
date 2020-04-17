<template>
  <code-otp
    :challenge-type="challengeType"
    :is-loading="isLoading"
    :is-phone-exist="$options.authStore.isPhoneExist"
    :email="email"
    :error="error"
    @send-code="sendCode"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import CodeOtp from './modules/CodeOtp';
import { authStore } from '@/store';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'CodeRequestInteractor',

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

    isLoading: {
      type: Boolean,
      required: true,
    },

    error: {
      type: String,
      required: true,
    },
  },

  methods: {
    async onSubmit({ code }) {
      if (this.isLoading) return;

      this.$emit('submit', { code });
    },

    async sendCode() {
      if (this.isLoading) return;

      try {
        this.$emit('update', {
          isLoading: true,
          error: '',
        });

        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.$emit('update', {
          error: this.$i18n.t('components.code.sendError'),
        });
      } finally {
        this.$emit('update', {
          isLoading: false,
        });
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
    CodeOtp,
  },
};
</script>
