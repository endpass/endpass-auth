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
      :email="email"
      @cancel="handleCancel"
      @submit="handleSignSubmit"
      @logout="handleLogout"
    />
    <create-wallet-form v-else-if="activeForm === FORMS.CREATE_WALLET" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PasswordForm from '@/components/forms/PasswordForm';
import CreateWalletForm from '@/components/forms/CreateWallet';

const FORMS = {
  SIGN: 'SIGN',
  CREATE_WALLET: 'CREATE_WALLET',
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

    email: {
      type: String,
      default: null,
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
    ...mapActions(['logout', 'checkAccountExists', 'waitAccountCreate']),

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
      this.activeForm = FORMS.CREATE_WALLET;
      await this.waitAccountCreate();
      this.activeForm = FORMS.SIGN;
    }

    this.isCheckingAccount = false;
  },

  components: {
    PasswordForm,
    CreateWalletForm,
  },
};
</script>
