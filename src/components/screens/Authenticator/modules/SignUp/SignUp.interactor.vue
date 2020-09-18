<template>
  <sign-up
    v-bind="$attrs"
    :initial-email="email"
    :is-loading="isLoading"
    :error.sync="error"
    @sign-in="onSignIn"
    @submit="onSubmit"
    @social="onSocial"
  />
</template>

<script>
import { authStore } from '@/store';
import SignUp from './SignUp.view';

export default {
  name: 'SignUpInteractor',

  props: {
    email: {
      type: String,
      default: '',
    },
  },

  authStore,

  data: () => ({
    isLoading: false,
    error: '',
  }),

  methods: {
    async onSubmit({ email, password }) {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        await this.$options.authStore.loadAuthChallenge({ email });
        this.$emit('sign-up', {
          email,
          password,
          isSignUp: true,
          isSocial: false,
        });
      } catch (e) {
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

    onSignIn() {
      this.$emit('sign-in');
    },
  },

  components: {
    SignUp,
  },
};
</script>
