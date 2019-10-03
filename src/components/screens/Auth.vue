<template>
  <screen @close="handleAuthCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="handleAuthCancel"
    >
      <composite-auth-form
        v-if="activeForm === FORMS.AUTH"
        :is-closable="isDialog"
        @authorize="handleAuthorize"
      />
      <create-wallet-form v-else-if="activeForm === FORMS.CREATE_WALLET" />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import CreateWalletForm from '@/components/forms/CreateWallet';
import { authStore, accountsStore, coreStore } from '@/store';

const FORMS = {
  AUTH: 'AUTH',
  CREATE_WALLET: 'CREATE_WALLET',
};

export default {
  name: 'Auth',

  accountsStore,
  authStore,
  coreStore,

  data: () => ({
    FORMS,
    activeForm: FORMS.AUTH,
  }),

  computed: {
    showCreateAccount() {
      return this.$options.coreStore.showCreateAccount;
    },

    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async handleAuthCancel() {
      if (this.activeForm === FORMS.CREATE_WALLET) {
        await this.$options.coreStore.logout();
      }

      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },

    async openCreateAccount() {
      const isExist = await this.$options.accountsStore.checkAccountExists();
      if (!isExist) {
        this.activeForm = FORMS.CREATE_WALLET;
        await this.$options.accountsStore.waitAccountCreate();
      }
    },

    async handleAuthorize({ serverMode } = {}) {
      if (this.showCreateAccount) {
        await this.openCreateAccount();
      }

      this.$options.authStore.confirmAuth(serverMode);
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
