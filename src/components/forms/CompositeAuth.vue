<template>
  <v-frame :loading="!inited" :closable="closable" @close="handleAuthCancel">
    <create-account-form
      v-if="isAuthorized && isAccountsEmpty"
      @request="handleAccountRequest"
    />
    <otp-form
      v-else-if="otpEmail && !recoverAccess"
      :loading="loading"
      :error="error"
      @submit="handleOtpSubmit"
      @recover="handleOtpRecover"
    />
    <recover-form
      v-else-if="otpEmail && recoverAccess && !sent"
      :loading="loading"
      :error="error"
      @submit="handleRecoverSubmit"
    />
    <message-form
      v-else-if="!isAuthorized && sent"
      :closable="closable"
      message="An email with authorization link was sent on your address. Open it in the same browser to sign in. Also check spam folder and exclude Endpass from spam filters."
      @cancel="handleAuthCancel"
    />
    <message-form
      v-else-if="isAuthorized && sent"
      message="You are successfully authorized. Dialog will be closed in a few seconds."
      @cancel="handleAuthCancel"
    />
    <auth-form
      v-else
      :inited="inited"
      :loading="loading"
      :error="error"
      :is-server-mode="isIdentityMode"
      :is-public="isPublic"
      @submit="handleAuthSubmit"
      @error="handleAuthError"
    />
  </v-frame>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import AuthForm from '@/components/forms/Auth';
import OtpForm from '@/components/forms/Otp';
import RecoverForm from '@/components/forms/Recover';
import MessageForm from '@/components/forms/Message';
import CreateAccountForm from '@/components/forms/CreateAccount';
import { IDENTITY_MODE } from '@/constants';

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
    needAccount: false,
    recoverAccess: false,
    serverMode: null,
  }),

  computed: {
    ...mapState({
      inited: state => state.core.inited,
      loading: state => state.core.loading,
      sent: state => state.accounts.linkSent,
      otpEmail: state => state.accounts.otpEmail,
      accounts: state => state.accounts.accounts,
      isAuthorized: state => state.accounts.isAuthorized,
      isIdentityMode: state => state.core.isIdentityMode,
    }),

    isAccountsEmpty() {
      return isEmpty(this.accounts);
    },
  },

  watch: {
    isAuthorized: {
      handler() {
        this.handleAuthorizationDataChange();
      },
      immediate: true,
    },

    accounts: {
      handler() {
        this.handleAuthorizationDataChange();
      },
    },
  },

  methods: {
    ...mapActions([
      'auth',
      'cancelAuth',
      'confirmAuth',
      'confirmAuthViaOtp',
      'awaitAuthMessage',
      'awaitAuthConfirm',
      'awaitAccountCreate',
      'openCreateAccountPage',
      'getRecoveryIdentifier',
      'recover',
      'dialogClose',
    ]),

    async handleOtpSubmit(code) {
      try {
        await this.confirmAuthViaOtp({
          email: this.otpEmail,
          code,
        });
      } catch (err) {
        console.error('handle error', err);
        this.handleAuthError(err);
      }
    },

    async handleOtpRecover() {
      try {
        await this.getRecoveryIdentifier();
        this.recoverAccess = true;
      } catch (err) {
        console.error(err);
        this.handleRecoverError(err);
      }
    },

    async handleRecoverSubmit(seedPhrase) {
      try {
        await this.recover({ seedPhrase });
      } catch (err) {
        console.error(err);
        this.handleRecoverError(err);
      }
    },

    async handleAuthSubmit({ email, serverMode }) {
      try {
        this.serverMode = serverMode;

        if (serverMode.type !== IDENTITY_MODE.DEFAULT) {
          return this.confirmAuth(serverMode);
        }

        await this.auth({ email, serverMode });
        await this.awaitAuthConfirm();
      } catch (err) {
        console.error(err);
        this.handleAuthError(err);
      }
    },

    handleAuthorizationDataChange() {
      const {
        isAuthorized,
        awaitAccountCreate,
        isAccountsEmpty,
        confirmAuth,
        serverMode,
      } = this;

      if (isAuthorized && isAccountsEmpty) {
        awaitAccountCreate();
      } else if (isAuthorized && !isAccountsEmpty) {
        this.$emit('authorize', {
          serverMode,
        });
      }
    },

    async handleAccountRequest() {
      this.openCreateAccountPage();
    },

    handleAuthCancel() {
      this.cancelAuth();
      this.dialogClose();
    },

    handleWindowClose() {
      this.cancelAuth();
      this.dialogClose();
    },

    handleAuthError() {
      this.error = 'Auth failed. Please, try again';
    },

    handleRecoverError(error) {
      this.error =
        (error && error.message) || 'Recover failed. Please, try again';
    },
  },

  components: {
    Screen,
    VFrame,
    AuthForm,
    OtpForm,
    RecoverForm,
    MessageForm,
    CreateAccountForm,
  },
};
</script>
