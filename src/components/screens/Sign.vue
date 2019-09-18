<template>
  <screen @close="handleWindowClose">
    <v-modal-card
      :loading="!request"
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
import { mapActions, mapGetters, mapState } from 'vuex';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import SignMessageForm from '@/components/forms/Sign/MessageForm';
import SignTransactionForm from '@/components/forms/Sign/TransactionForm';

export default {
  name: 'Sign',

  data: () => ({
    error: null,
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
      loading: state => state.core.loading,
      request: state => state.requests.request,
      settings: state => state.accounts.settings,
    }),
    ...mapGetters(['isDialog']),

    isTransaction() {
      return get(this.request, 'request.method') === 'eth_sendTransaction';
    },
  },

  methods: {
    ...mapActions(['processRequest', 'cancelRequest', 'dialogClose']),

    async handleSignSubmit(res) {
      try {
        await this.processRequest(res);
        this.error = null;
      } catch (err) {
        this.error = err.message;
      }
    },

    handleSignCancel() {
      this.cancelRequest();
      this.dialogClose();
    },

    handleWindowClose() {
      this.cancelRequest();
      this.dialogClose();
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
