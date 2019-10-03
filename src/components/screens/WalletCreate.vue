<template>
  <screen @close="onCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="onCancel"
    >
      <wallet-create-form @submit="onCreate" />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import WalletCreateForm from '@/components/forms/WalletCreate';
import { accountsStore, coreStore } from '@/store';

export default {
  name: 'CreateWallet',

  accountsStore,
  coreStore,

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async onCancel() {
      this.$options.accountsStore.cancelCreateWallet();
      this.$options.coreStore.dialogClose();
    },

    onCreate() {
      this.$options.accountsStore.createWalletFinish();
    },
  },

  components: {
    Screen,
    VModalCard,
    WalletCreateForm,
  },
};
</script>
