<template>
  <sign-in
    :is-loading="isLoading"
    :error.sync="error"
    :is-server-mode="isServerMode"
    @sign-up="onSignUp"
    @submit="onSignIn"
    @social="onSocial"
  />
</template>

<script>
import { CHALLENGE_TYPES, IDENTITY_MODE } from '@/constants';
import { coreStore, authStore } from '@/store';
import SignIn from './SignIn.view';

const SING_IN_CHALLENGE_TYPES = [
  CHALLENGE_TYPES.APP_OTP,
  CHALLENGE_TYPES.SMS_OTP,
];

export default {
  name: 'SignInInteractor',

  coreStore,
  authStore,

  props: {
    challengeType: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    error: '',
  }),

  computed: {
    isServerMode() {
      return this.$options.coreStore.isServerMode;
    },
  },

  methods: {
    onSignUp() {
      this.$emit('sign-up');
    },

    async onSignIn({ email, serverMode }) {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        if (serverMode.type === IDENTITY_MODE.DEFAULT) {
          await this.$options.authStore.loadAuthChallenge({ email });
        }

        this.$emit('sign-in', { email, serverMode });
      } catch (error) {
        this.error = this.$i18n.t('components.compositeAuth.authFailed');
      } finally {
        this.isLoading = false;
      }
    },

    async onSocial({ email }) {
      if (SING_IN_CHALLENGE_TYPES.includes(this.challengeType)) {
        this.$emit('sign-in', { email });
        return;
      }

      this.isLoading = true;
      await this.$options.authStore.waitLogin();

      this.$emit('social');
      this.isLoading = false;
    },
  },

  components: {
    SignIn,
  },
};
</script>
