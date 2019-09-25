<template>
  <div>
    <otp-block-form
      v-if="currentForm === FORMS.OTP"
      @submit="handleOtpSubmit"
      @recover="handleOtpRecover"
    />
    <message-form
      v-else-if="currentForm === FORMS.MESSAGE"
      :closable="closable"
      :message="message"
      @cancel="handleAuthCancel"
    />
    <auth-form
      v-else-if="currentForm === FORMS.AUTH"
      :is-inited="isInited"
      :loading="loading"
      :error="error"
      :is-server-mode="isIdentityMode"
      :is-public="isPublic"
      @socialSubmit="handleSocialSubmit"
      @submit="handleAuthSubmit"
      @error="handleAuthError"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AuthForm from '@/components/forms/Auth';
import OtpBlockForm from '@/components/formsComposite/CompositeAuth/OtpBlock';
import MessageForm from '@/components/forms/Message';
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

  data: () => ({
    error: null,
    serverMode: null,
    currentForm: FORMS.AUTH,
    message: '',
    FORMS,
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
      loading: state => state.core.loading,
      otpEmail: state => state.accounts.otpEmail,
      isIdentityMode: state => state.core.isIdentityMode,
      isLogin: state => state.accounts.isLogin,
    }),
  },

  methods: {
    async handleOtpSubmit() {
      await accountsStore.waitLogin();

      this.handleSubmit();
    },

    async handleOtpRecover() {
      await this.handleLinkSent();
    },

    async handleSocialSubmit() {
      await accountsStore.waitLogin();

      this.handleSubmit();
    },

    async handleAuthSubmit({ email, serverMode }) {
      try {
        this.serverMode = serverMode;

        if (serverMode.type !== IDENTITY_MODE.DEFAULT) {
          this.handleSubmit();
          return;
        }

        await accountsStore.auth({ email, serverMode });

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
      await accountsStore.defineAuthStatus();
      if (this.isLogin) {
        this.message = this.$i18n.t(
          'components.compositeAuth.successAuthMessage',
        );
      } else {
        this.message = this.$i18n.t('components.compositeAuth.linkSentMessage');
        this.currentForm = FORMS.MESSAGE;
        await accountsStore.waitLogin();
      }

      this.handleSubmit();
    },

    handleAuthCancel() {
      accountsStore.cancelAuth();
      coreStore.dialogClose();
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
    OtpBlockForm,
    MessageForm,
  },
};
</script>
