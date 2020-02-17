<template>
  <recovery-view
    :is-loading="isLoading"
    :error="error"
    :is-phone-exist="isPhoneExist"
    @submit="onSubmit"
    @cancel="onCancel"
    @send-code="sendCode"
  />
</template>

<script>
import RecoveryView from './modules/RecoveryView';
import { authStore } from '@/store';
import createRecoverController from './RecoveryController';

export default {
  name: 'RecoveryCodeInteractor',

  authStore,
  recoverController: createRecoverController(),

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isPhoneExist: true,
    isLoading: false,
    error: '',
  }),

  methods: {
    async sendCode() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';
        const { email } = this;

        await this.$options.recoverController.sendSms({ email });
      } catch (error) {
        if (error.code === 400) {
          this.isPhoneExist = false;
          return;
        }

        this.error = this.$i18n.t('components.recoverOtpSms.sendSmsError');
      } finally {
        this.isLoading = false;
      }
    },

    async onSubmit({ code }) {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.error = '';

        const { email } = this;

        await this.$options.recoverController.disableOtp({
          email,
          code,
        });

        this.$emit('recovered');
      } catch (err) {
        this.error = this.$i18n.t('components.recoverOtpSms.recoverError');
      } finally {
        this.isLoading = false;
      }
    },

    onCancel() {
      this.$emit('recovery-cancel');
    },
  },

  mounted() {
    this.sendCode();
  },

  components: {
    RecoveryView,
  },
};
</script>
