<template>
  <screen @close="handleAuthCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="handleAuthCancel"
    >
      <composite-auth-form
        v-if="activeForm === FORMS.AUTH"
        :closable="isDialog"
        @authorize="handleAuthorize"
      />
      <create-wallet-form v-else-if="activeForm === FORMS.CREATE_WALLET" />
    </v-modal-card>
  </screen>
</template>

<script>
import { mapState } from 'vuex';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/formsComposite/CompositeAuth';
import CreateWalletForm from '@/components/forms/CreateWallet';
import { accountsStore, coreStore } from '@/store';

const FORMS = {
  AUTH: 'AUTH',
  CREATE_WALLET: 'CREATE_WALLET',
};

export default {
  name: 'Auth',

  data: () => ({
    FORMS,
    activeForm: FORMS.AUTH,
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
      showCreateAccount: state => state.core.showCreateAccount,
    }),

    isDialog() {
      return coreStore.isDialog;
    },
  },

  methods: {
    async handleAuthCancel() {
      if (this.activeForm === FORMS.CREATE_WALLET) {
        await coreStore.logout();
      }

      accountsStore.cancelAuth();
      coreStore.dialogClose();
    },

    async openCreateAccount() {
      const isExist = await accountsStore.checkAccountExists();
      if (!isExist) {
        this.activeForm = FORMS.CREATE_WALLET;
        await accountsStore.waitAccountCreate();
      }
    },

    async handleAuthorize({ serverMode } = {}) {
      if (this.showCreateAccount) {
        await this.openCreateAccount();
      }

      accountsStore.confirmAuth(serverMode);
    },
  },

  components: {
    Screen,
    VModalCard,
    CompositeAuthForm,
    CreateWalletForm,
  },
};
</script>
