<template>
  <div>
    <auth-form
      v-if="currentForm === FORMS.AUTH"
      :is-inited="isInited"
      :loading="loading"
      :error="error"
      :is-server-mode="isIdentityMode"
      :is-regular-password-mode="isRegularPasswordMode"
      :is-public="isPublic"
      @socialSubmit="handleSocialSubmit"
      @submit="handleAuthSubmit"
      @error="handleAuthError"
    />
    <otp-form
      v-else-if="currentForm === FORMS.OTP"
      @submit="handleOtpSubmit"
      @recover="handleOtpRecover"
    />
    <message-form
      v-else-if="currentForm === FORMS.MESSAGE"
      :closable="closable"
      :message="message"
      @cancel="handleAuthCancel"
    />
  </div>
</template>

<script>
import AuthForm from './Auth';
import OtpForm from './Otp';
import MessageForm from './Message';
import { IDENTITY_MODE } from '@/constants';
import { accountsStore, coreStore } from '@/store';

const FORMS = {
  AUTH: 'AUTH',
  MESSAGE: 'MESSAGE',
  OTP: 'OTP',
};

export default {
  name: 'CompositeAuth',

  props: {
    closable: {
      type: Boolean,
      default: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },
  },

  accountsStore,
  coreStore,

  data: () => ({
    error: null,
    serverMode: null,
    currentForm: FORMS.AUTH,
    message: '',
    FORMS,
  }),

  computed: {
    isInited() {
      return this.$options.coreStore.isInited;
    },
    loading() {
      return this.$options.coreStore.loading;
    },
    otpEmail() {
      return this.$options.accountsStore.otpEmail;
    },
    isIdentityMode() {
      return this.$options.coreStore.isIdentityMode;
    },
    isRegularPasswordMode() {
      return this.$options.coreStore.isRegularPasswordMode;
    },
    isLogin() {
      return this.$options.accountsStore.isLogin;
    },
  },

  methods: {
    async handleOtpSubmit() {
      await this.$options.accountsStore.waitLogin();

      this.handleSubmit();
    },

    async handleOtpRecover() {
      await this.handleLinkSent();
    },

    async handleSocialSubmit() {
      await this.$options.accountsStore.waitLogin();

      this.handleSubmit();
    },

    async handleAuthSubmit({ email, serverMode }) {
      try {
        this.serverMode = serverMode;

        if (serverMode.type !== IDENTITY_MODE.DEFAULT) {
          this.handleSubmit();
          return;
        }

        await this.$options.accountsStore.auth({ email, serverMode });

        if (this.otpEmail) {
          this.currentForm = FORMS.OTP;
        } else {
          await this.handleLinkSent();
        }
      } catch (err) {
        console.error(err);
        this.handleAuthError(err);
      }
    },

    async handleLinkSent() {
      await this.$options.accountsStore.defineAuthStatus();
      if (this.isLogin) {
        this.message = this.$i18n.t(
          'components.compositeAuth.successAuthMessage',
        );
      } else {
        this.message = this.$i18n.t('components.compositeAuth.linkSentMessage');
        this.currentForm = FORMS.MESSAGE;
        await this.$options.accountsStore.waitLogin();
      }

      this.handleSubmit();
    },

    handleAuthCancel() {
      this.$options.accountsStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },

    handleAuthError() {
      this.error = this.$i18n.t('components.compositeAuth.authFailed');
    },

    handleSubmit() {
      this.$emit('authorize', {
        serverMode: this.serverMode,
      });
    },
  },

  components: {
    AuthForm,
    OtpForm,
    MessageForm,
  },
};
</script>
