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
      :inited="inited"
      :loading="loading"
      :error="error"
      :is-server-mode="isIdentityMode"
      :is-public="isPublic"
      @submit="handleAuthSubmit"
      @error="handleAuthError"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AuthForm from '@/components/forms/CompositeAuth/Auth';
import OtpBlockForm from '@/components/forms/CompositeAuth/OtpBlock';
import MessageForm from '@/components/forms/CompositeAuth/Message';
import { IDENTITY_MODE } from '@/constants';

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
      inited: state => state.core.inited,
      loading: state => state.core.loading,
      otpEmail: state => state.accounts.otpEmail,
      isIdentityMode: state => state.core.isIdentityMode,
      isLogin: state => state.accounts.isLogin,
    }),
  },

  methods: {
    ...mapActions(['auth', 'cancelAuth', 'waitLogin', 'dialogClose']),

    async handleOtpSubmit() {
      await this.waitLogin();

      this.handleSubmit();
    },

    async handleOtpRecover() {
      await this.handleLinkSent();
    },

    async handleAuthSubmit({ email, serverMode }) {
      try {
        this.serverMode = serverMode;

        if (serverMode.type !== IDENTITY_MODE.DEFAULT) {
          this.handleSubmit();
          return;
        }

        await this.auth({ email, serverMode });

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
      this.message = this.isLogin
        ? 'You are successfully authorized. Dialog will be closed in a few seconds.'
        : 'An email with authorization link was sent on your address. Open it in the same browser to sign in. Also check spam folder and exclude Endpass from spam filters.';

      this.currentForm = FORMS.MESSAGE;

      await this.waitLogin();

      this.handleSubmit();
    },

    handleAuthCancel() {
      this.cancelAuth();
      this.dialogClose();
    },

    handleAuthError() {
      this.error = 'Auth failed. Please, try again';
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
