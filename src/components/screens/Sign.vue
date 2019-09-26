<template>
  <screen @close="handleWindowClose">
    <v-modal-card
      :is-closable="isDialog"
      @close="handleSignCancel"
    >
      <sign-transaction-form
        v-if="isTransaction"
        :loading="loading"
        :request="request"
        :error="error"
        :closable="isDialog"
        @cancel="handleSignCancel"
        @submit="handleSignSubmit"
      />
      <sign-message-form
        v-else
        :loading="loading"
        :request="request"
        :error="error"
        :closable="isDialog"
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

  data: () => ({
    error: null,
  }),

  computed: {
    isInited() {
      return coreStore.isInited;
    },
    loading() {
      return coreStore.loading;
    },
    request() {
      return requestStore.request;
    },
    settings() {
      return accountsStore.settings;
    },

    isDialog() {
      return coreStore.isDialog;
    },

    isTransaction() {
      return get(this.request, 'request.method') === 'eth_sendTransaction';
    },
  },

  methods: {
    async handleSignSubmit(res) {
      try {
        await requestStore.processRequest(res);
        this.error = null;
      } catch (err) {
        this.error = err.message;
      }
    },

    handleSignCancel() {
      requestStore.cancelRequest();
      coreStore.dialogClose();
    },

    handleWindowClose() {
      requestStore.cancelRequest();
      coreStore.dialogClose();
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
