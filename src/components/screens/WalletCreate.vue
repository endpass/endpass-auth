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
import { coreStore } from '@/store';
import createWalletController from '@/controllers/WalletController';

export default {
  name: 'CreateWallet',

  coreStore,
  walletController: createWalletController(),

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async createHandler({ password }) {
      const data = await this.$options.walletController.generateWallet({
        password,
      });
      await this.$options.walletController.saveWallet(data);
      return data;
    },

    async onCancel() {
      this.$options.walletController.cancelCreateWallet();
      this.$options.coreStore.dialogClose();
    },

    onCreate(payload) {
      this.$options.walletController.createWalletFinish(payload);
    },
  },

  components: {
    Screen,
    VModalCard,
    WalletCreateForm,
  },
};
</script>
