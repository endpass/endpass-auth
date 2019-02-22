<template>
  <screen>
    <v-frame :loading="!inited" :closable="isDialog" @close="handleAuthCancel">
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
        :closable="isDialog"
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
        :is-server-mode="isServerMode"
        @submit="handleAuthSubmit"
        @error="handleAuthError"
      />
    </v-frame>
  </screen>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapState } from 'vuex';
import Screen from '../Screen.vue';
import VFrame from '../VFrame.vue';
import AuthForm from '../forms/Auth.vue';
import OtpForm from '../forms/Otp.vue';
import RecoverForm from '../forms/Recover.vue';
import MessageForm from '../forms/Message.vue';
import CreateAccountForm from '../forms/CreateAccount.vue';
import { IDENTITY_MODE } from '@/constants';

export default {
  name: 'Auth',

  data: () => ({
    error: null,
    needAccount: false,
    recoverAccess: false,
    isServerMode: false,
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
    }),
    ...mapGetters(['isDialog']),

    confirmed() {
      return this.isAuthorized && this.sent;
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
        this.handleAuthError(err);
      }
    },

    async handleRecoverSubmit(seedPhrase) {
      try {
        await this.recover({ seedPhrase });
      } catch (err) {
        console.error(err);
        this.handleAuthError(err);
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
        confirmAuth(serverMode);
      }
    },

    async handleAccountRequest() {
      this.openCreateAccountPage();
    },

    handleAuthCancel() {
      this.cancelAuth();
    },

    handleWindowClose() {
      this.cancelAuth();
    },

    handleAuthError(error) {
      this.error = 'Auth failed. Please, try again';
    },
  },

  async created() {
    this.isServerMode = Boolean(this.$route.query.mode);

    if (this.isDialog) {
      window.addEventListener('beforeunload', this.handleWindowClose);
    }
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
