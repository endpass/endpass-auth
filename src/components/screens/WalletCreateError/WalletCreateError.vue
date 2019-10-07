<template>
  <screen @close="onCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="onCancel"
    >
      <form-item>
        <message
          :error="true"
          data-test="wallet-create-error"
        >
          {{ $t('components.walletCreateError.error') }}
        </message>
      </form-item>
      <form-item>
        <v-button
          :disabled="isLoading"
          :is-loading="isLoading"
          skin="quaternary"
          data-test="submit-button"
          @click="checkExist"
        >
          {{ $t('components.walletCreateError.check') }}
        </v-button>
      </form-item>
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import VButton from '@endpass/ui/kit/VButton';
import Screen from '@/components/common/Screen';
import { coreStore } from '@/store';

import createWalletExistController from './WalletExistController';
import Message from '@/components/common/Message';
import FormItem from '@/components/common/FormItem';

export default {
  name: 'WalletCreateError',

  coreStore,
  walletExistController: createWalletExistController(),

  data: () => ({
    isLoading: false,
  }),

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async onCancel() {
      if (this.isLoading) return;

      this.isLoading = true;
      await this.$options.walletExistController.cancelCheck();
      this.isLoading = false;
    },

    async checkExist() {
      if (this.isLoading) return;

      this.isLoading = true;
      try {
        const isExist = await this.$options.walletExistController.checkAccountExist();
        this.$options.coreStore.dialogClose();
        this.$options.walletExistController.setExist(isExist);
      } catch (e) {
      } finally {
        this.isLoading = false;
      }
    },
  },

  components: {
    FormItem,
    Message,
    Screen,
    VModalCard,
    VButton,
  },
};
</script>
