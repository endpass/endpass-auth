<template>
  <screen @close="handleWindowClose">
    <v-frame :loading="!inited">
      <composite-auth-form
        :mode="currentAuthMode"
        :loading="loading"
        :error="error"
        :inited="inited"
        @recover="handleRecover"
        @submit="handleAuthSubmit"
        @account-request="handleAccountRequest"
        @error="handleAuthError"
      />
    </v-frame>
  </screen>
</template>

<script>
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapState } from 'vuex';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import CompositeAuthForm from '@/components/forms/CompositeAuth';

export default {
  name: 'Auth',

  data: () => ({
    error: null,
    recoverAccess: false,
  }),

  computed: {
    ...mapState({
      inited: state => state.core.inited,
      loading: state => state.core.loading,
      sent: state => state.accounts.linkSent,
      otpEmail: state => state.accounts.otpEmail,
      accounts: state => state.accounts.accounts,
      isAuthorized: state => state.accounts.isAuthorized,
    }),
    ...mapGetters(['isDialog']),

    currentAuthMode() {
      const {
        isAuthorized,
        isAccountsEmpty,
        otpEmail,
        recoverAccess,
        sent,
      } = this;

      switch (true) {
        case !isAuthorized && sent:
          return 'sent';
        case isAuthorized && isAccountsEmpty:
          return 'create';
        case otpEmail && recoverAccess && !sent:
          return 'recover';
        case otpEmail && !recoverAccess:
          return 'otp';
        case isAuthorized && sent:
          return 'authorized';
        default:
          return null;
      }
    },

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
      'redirectToLogin',
      'auth',
      'cancelAuth',
      'confirmAuthViaOtp',
      'awaitAuthMessage',
      'awaitAuthConfirm',
      'awaitAccountCreate',
      'openCreateAccountPage',
      'getRecoveryIdentifier',
      'recover',
      'dialogClose',
    ]),

    handleAuthorizationDataChange() {
      const { isAuthorized, isAccountsEmpty } = this;

      if (isAuthorized && !isAccountsEmpty) {
        this.redirectToLogin(this.$router);
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

    async handleAuthSubmit(payload) {
      switch (this.currentAuthMode) {
        case 'otp':
          this.handleOtpFormSubmit(payload);
          break;
        case 'recover':
          this.handleRecoverFormSubmit();
          break;
        default:
          this.handleAuthFormSubmit(payload);
      }
    },

    async handleAuthFormSubmit({ email, serverMode }) {
      try {
        await this.auth({ email, serverMode });
        await this.awaitAuthConfirm();
      } catch (err) {
        console.error(err);
        this.handleAuthError(err);
      }
    },

    async handleOtpFormSubmit(code) {
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

    async handleRecoverFormSubmit(seedPhrase) {
      try {
        await this.recover({ seedPhrase });
      } catch (err) {
        console.error(err);
        this.handleRecoverError(err);
      }
    },

    handleRecover(payload) {
      switch (this.currentAuthMode) {
        case 'otp':
          this.handleOtpRecover(payload);
          break;
        default:
          break;
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

    handleError(err) {
      switch (this.currentAuthMode) {
        default:
          this.handleAuthError(err);
      }
    },

    handleAuthError() {
      this.error = 'Auth failed. Please, try again';
    },

    handleRecoverError(error) {
      const errorMessage = get(error, 'message');

      if (errorMessage) {
        this.error = errorMessage;
      } else {
        this.error = 'Recover failed. Please, try again';
      }
    },
  },

  components: {
    Screen,
    VFrame,
    CompositeAuthForm,
  },
};
</script>
