<template>
  <div>
    <password-form
      v-if="activeForm === FORMS.SIGN"
      :is-loading="isLoadProcess"
      :error="error"
      :closable="isDialog"
      :with-logout-btn="withLogoutBtn"
      :requester-url="requesterUrl"
      :message="message"
      @cancel="handleCancel"
      @submit="handleSignSubmit"
      @logout="handleLogout"
    />
    <create-account-form
      v-if="activeForm === FORMS.CREATE_ACCOUNT"
      @request="handleAccountRequest"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PasswordForm from '@/components/forms/SignPassword/PasswordForm';
import CreateAccountForm from '@/components/forms/CreateAccount';

const FORMS = {
  SIGN: 'SIGN',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
};

export default {
  name: 'SignPasswordForm',

  props: {
    withLogoutBtn: {
      type: Boolean,
      default: false,
    },

    requesterUrl: {
      type: String,
      default: '',
    },

    message: {
      type: String,
      default: '',
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    isCheckingAccount: false,
    FORMS,
    activeForm: FORMS.SIGN,
  }),

  computed: {
    ...mapGetters(['isDialog']),
    isLoadProcess() {
      return this.isLoading || this.isCheckingAccount;
    },
  },

  methods: {
    ...mapActions([
      'openCreateAccountPage',
      'logout',
      'checkAccountExists',
      'awaitAccountCreate',
    ]),

    handleAccountRequest() {
      this.openCreateAccountPage();
    },

    handleLogout() {
      this.logout();
      this.handleCancel();
    },

    async handleSignSubmit(password) {
      this.$emit('submit', password);
    },

    handleCancel() {
      this.$emit('cancel');
    },
  },

  async mounted() {
    this.isCheckingAccount = true;

    const isExist = await this.checkAccountExists();

    if (!isExist) {
      this.activeForm = FORMS.CREATE_ACCOUNT;
      await this.awaitAccountCreate();
      this.activeForm = FORMS.SIGN;
    }

    this.isCheckingAccount = false;
  },

  components: {
    PasswordForm,
    CreateAccountForm,
  },
};
</script>
