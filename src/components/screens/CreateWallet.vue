<template>
  <screen @close="onCreateCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="onCreateCancel"
    >
      <create-wallet-form />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import CreateWalletForm from '@/components/forms/CreateWallet';
import { authStore, accountsStore, coreStore } from '@/store';

export default {
  name: 'CreateWallet',

  accountsStore,
  authStore,
  coreStore,

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async onCreateCancel() {
      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },

    // async openCreateAccount() {
    //   const isExist = await this.$options.accountsStore.checkAccountExists();
    //   if (!isExist) {
    //     await this.$options.accountsStore.waitAccountCreate();
    //   }
    // },
  },

  components: {
    Screen,
    VModalCard,
    CreateWalletForm,
  },
};
</script>
