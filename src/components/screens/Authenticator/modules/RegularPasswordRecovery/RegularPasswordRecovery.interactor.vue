<template>
  <regular-password-recovery
    v-bind="$attrs"
    :error="error"
    :email="email"
    :is-loading="isLoading"
    @cancel="onCancel"
    @submit="onSubmit"
    @send-code="sendCode"
  />
</template>

<script>
import { authStore } from '@/store';
import RegularPasswordRecovery from './RegularPasswordRecovery.view';

export default {
  name: 'RegularPasswordRecoveryInteractor',

  authStore,

  props: {
    email: {
      type: String,
      required: true,
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

        this.$emit('password-recovered', { password });
      } catch (error) {
        this.error = this.$i18n.t(
          'components.regularPasswordRecover.recoveryError',
        );
      } finally {
        this.isLoading = false;
      }
    },

    async sendCode() {
      if (this.isLoading) return;

      try {
        this.error = '';
        this.isLoading = true;

        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.error = this.$i18n.t(
          'components.regularPasswordRecover.sendError',
        );
      } finally {
        this.isLoading = false;
      }
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  mounted() {
    this.sendCode();
  },

  components: {
    RegularPasswordRecovery,
  },
};
</script>
