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
import { IDENTITY_MODE } from '@/constants';
import { coreStore, authStore } from '@/store';
import SignIn from './SignIn.view';

export default {
  name: 'SignInInteractor',

  coreStore,
  authStore,

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

        let isPasswordExist = false;

        if (serverMode.type === IDENTITY_MODE.DEFAULT) {
          await this.$options.authStore.loadAuthChallenge({ email });

          isPasswordExist = await this.$options.authStore.checkRegularPassword(
            email,
          );
        }

        this.$emit('sign-in', { email, serverMode, isPasswordExist });
      } catch (error) {
        this.error = this.$i18n.t('components.compositeAuth.authFailed');
      } finally {
        this.isLoading = false;
      }
    },

    async onSocial() {
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
