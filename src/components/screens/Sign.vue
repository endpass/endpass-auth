<template>
  <screen @close="handleWindowClose">
    <v-modal-card
      :is-closable="isDialog"
      @close="handleSignCancel"
    >
      <sign-transaction-form
        v-if="isTransaction"
        :is-loading="isLoading"
        :request="request"
        :error="error"
        :is-closable="isDialog"
        @cancel="handleSignCancel"
        @submit="handleSignSubmit"
      />
      <sign-message-form
        v-else
        :is-loading="isLoading"
        :request="request"
        :error="error"
        :is-closable="isDialog"
        @cancel="handleSignCancel"
        @submit="handleSignSubmit"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import get from 'lodash/get';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import SignMessageForm from '@/components/forms/Sign/MessageForm';
import SignTransactionForm from '@/components/forms/Sign/TransactionForm';
import { accountsStore, coreStore, requestStore } from '@/store';

export default {
  name: 'Sign',

  accountsStore,
  coreStore,
  requestStore,

  data: () => ({
    error: null,
  }),

  computed: {
    isInited() {
      return this.$options.coreStore.isInited;
    },
    isLoading() {
      return this.$options.coreStore.isLoading;
    },
    request() {
      return this.$options.requestStore.request;
    },
    settings() {
      return this.$options.accountsStore.settings;
    },

    isDialog() {
      return this.$options.coreStore.isDialog;
    },

    isTransaction() {
      return get(this.request, 'request.method') === 'eth_sendTransaction';
    },
  },

  methods: {
    async handleSignSubmit(res) {
      try {
        await this.$options.requestStore.processRequest(res);
        this.error = null;
      } catch (err) {
        this.error = err.message;
      }
    },

    handleSignCancel() {
      this.$options.requestStore.cancelRequest();
      this.$options.coreStore.dialogClose();
    },

    handleWindowClose() {
      this.$options.requestStore.cancelRequest();
      this.$options.coreStore.dialogClose();
    },
  },

  components: {
    Screen,
    SignMessageForm,
    SignTransactionForm,
    VModalCard,
  },
};
</script>
