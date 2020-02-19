<template>
  <regular-password-creation
    v-bind="$attrs"
    :is-loading="isLoading"
    :error="error"
    :email="email"
    @submit="onSubmit"
    @send-code="sendCode"
  />
</template>

<script>
import RegularPasswordCreation from './RegularPasswordCreation.view';
import { authStore } from '@/store';

export default {
  name: 'RegularPasswordCreationInteractor',

  authStore,

  props: {
    email: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    isLoading: false,
    error: '',
  }),

  methods: {
    async onSubmit({ password, code }) {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        await this.$options.authStore.confirmResetRegularPassword({
          password,
          code,
        });

        this.$emit('password-created', { password });
      } catch (error) {
        this.error = this.$i18n.t('components.createPassword.confirmError');
      } finally {
        this.isLoading = false;
      }
    },

    async sendCode() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        await this.$options.authStore.resetRegularPassword({
          email: this.email,
        });
      } catch (e) {
        this.error = this.$i18n.t('components.createPassword.sendError');
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.sendCode();
  },

  components: {
    RegularPasswordCreation,
  },
};
</script>
