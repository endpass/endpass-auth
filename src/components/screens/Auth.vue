<template>
  <screen @close="handleAuthCancel">
    <v-frame
      :loading="!isInited"
      :closable="isDialog"
      @close="handleAuthCancel"
    >
      <composite-auth-form
        v-if="activeForm === FORMS.AUTH"
        :closable="isDialog"
        @authorize="handleAuthorize"
      />
      <create-wallet-form
        v-else-if="activeForm === FORMS.CREATE_WALLET"
        @request="handleAccountRequest"
      />
    </v-frame>
  </screen>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import CreateWalletForm from '@/components/forms/CreateWallet';

const FORMS = {
  AUTH: 'AUTH',
  CREATE_WALLET: 'CREATE_WALLET',
};

export default {
  name: 'Auth',

  data: () => ({
    isCheckingAccount: false,
    FORMS,
    activeForm: FORMS.AUTH,
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
      showCreateAccount: state => state.core.showCreateAccount,
    }),

    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions([
      'confirmAuth',
      'cancelAuth',
      'dialogClose',
      'openCreateAccountPage',
      'checkAccountExists',
      'waitAccountCreate',
    ]),

    handleAuthCancel() {
      this.cancelAuth();
      this.dialogClose();
    },

    async handleAccountRequest() {
      this.openCreateAccountPage();
    },

    async openCreateAccount() {
      const isExist = await this.checkAccountExists();
      if (!isExist) {
        this.activeForm = FORMS.CREATE_WALLET;
        await this.waitAccountCreate();
      }
    },

    async handleAuthorize({ serverMode } = {}) {
      if (this.showCreateAccount) {
        await this.openCreateAccount();
      }

      this.confirmAuth(serverMode);
    },
  },

  components: {
    Screen,
    VFrame,
    CompositeAuthForm,
    CreateWalletForm,
  },
};
</script>
