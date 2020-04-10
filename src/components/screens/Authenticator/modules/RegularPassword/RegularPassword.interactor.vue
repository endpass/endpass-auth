<template>
  <regular-password
    :password.sync="password"
    :error="error"
    @submit="onSubmit"
    @recover="onRecover"
  />
</template>

<script>
import RegularPassword from './RegularPassword.view';
import { authStore } from '@/store';

export default {
  name: 'RegularPasswordInteractor',

  authStore,

  props: {
    email: {
      type: String,
      required: true,
    },

    isSignUp: {
      type: Boolean,
      required: true,
    },

    isRemember: {
      type: Boolean,
      required: true,
    },

    isRemembered: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    password: '',
    error: '',
    isLoading: false,
  }),

  methods: {
    async onSubmit({ password }) {
      if (this.isLoading) return;

      if (this.isRemembered) {
        await this.auth();
      }

      if (this.error) return;

      this.$emit('submit', { password });
    },

    onRecover() {
      this.$emit('recover');
    },

    async auth() {
      try {
        this.isLoading = true;
        this.error = '';

        const { email, password, isSignUp, isRemember } = this;

        await this.$options.authStore.authWithCode({
          isSignUp,
          email,
          password,
          isRemember,
        });

        this.$emit('complete');
      } catch (err) {
        this.error = this.$i18n.t('components.code.authFailed');
      } finally {
        this.isLoading = false;
      }
    },
  },

  components: {
    RegularPassword,
  },
};
</script>
