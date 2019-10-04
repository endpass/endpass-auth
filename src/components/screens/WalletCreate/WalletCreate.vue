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
import { coreStore } from '@/store';

import createWalletCreateController from './WalletCreateController';

export default {
  name: 'CreateWallet',

  coreStore,

  walletCreateController: createWalletCreateController(),

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async onCancel() {
      this.$options.walletCreateController.cancelCreateWallet();
      this.$options.coreStore.dialogClose();
    },

    onCreate() {
      this.$options.walletCreateController.createWalletFinish();
    },
  },

  components: {
    Screen,
    VModalCard,
    WalletCreateForm,
  },
};
</script>
