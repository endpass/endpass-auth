<template>
  <screen @close="onCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="onCancel"
    >
      <wallet-create-form
        :create-handler="createHandler"
        @submit="onCreate"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import WalletCreateForm from '@/components/forms/WalletCreate/WalletCreate';
import { coreStore, walletStore } from '@/store';

export default {
  name: 'GenerateWallet',

  coreStore,
  walletStore,

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async createHandler({ password }) {
      const data = await this.$options.walletStore.generateWallet({ password });
      return data;
    },

    async onCancel() {
      this.$options.walletStore.cancelCreateWallet();
      this.$options.coreStore.dialogClose();
    },

    onCreate(payload) {
      this.$options.walletStore.createWalletFinish(payload);
    },
  },

  components: {
    Screen,
    VModalCard,
    WalletCreateForm,
  },
};
</script>
