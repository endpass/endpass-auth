<template>
  <regular-password
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

    isRemembered: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    error: '',
    isLoading: false,
  }),

  methods: {
    async onSubmit({ password }) {
      if (this.isLoading) return;

      if (this.isRemembered) {
        await this.auth({ password });
      }

      if (this.error) return;

      this.$emit('submit', { password });
    },

    async auth({ password }) {
      try {
        this.isLoading = true;
        this.error = '';

        const { email, isSignUp } = this;

        await this.$options.authStore.authWithCode({
          isSignUp,
          email,
          password,
          isRemember: true,
        });
      } catch (err) {
        this.error = this.$i18n.t('components.code.authFailed');
      } finally {
        this.isLoading = false;
      }
    },

    onRecover() {
      this.$emit('recover');
    },
  },

  components: {
    RegularPassword,
  },
};
</script>
