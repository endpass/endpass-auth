<template>
  <screen @close="handleWindowClose">
    <v-modal-card
      :loading="!request"
      :is-closable="isDialog"
      @close="handleSignCancel"
    >
      <sign-form
        :loading="loading"
        :request="request"
        :error="error"
        :closable="isDialog"
        :gas-prices="gasPrices"
        :is-transaction="isTransaction"
        @cancel="handleSignCancel"
        @submit="handleSignSubmit"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import Web3 from 'web3';
import get from 'lodash/get';
import { mapActions, mapGetters, mapState } from 'vuex';
import Screen from '@/components/common/Screen';
import VModalCard from '@endpass/ui/kit/VModalCard';
import SignForm from '@/components/forms/Sign';

const { fromWei } = Web3.utils;

export default {
  name: 'Sign',

  data: () => ({
    error: null,
    gasPrices: null,
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
    ...mapActions([
      'processRequest',
      'cancelRequest',
      'dialogClose',
      'getGasPrice',
    ]),

    async handleSignSubmit(res) {
      try {
        debugger;
        // await this.processRequest(res.password);
        this.error = null;
      } catch (err) {
        console.log(err);
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

  async created() {
    if (!this.isTransaction) return;

    const { net } = this.request;
    const gasPrices = await this.getGasPrice(net);

    this.gasPrices = Object.keys(gasPrices).reduce(
      (acc, key) =>
        acc.concat({
          label: `${gasPrices[key]} gwei`,
          value: fromWei(gasPrices[key].toString(), 'gwei'),
        }),
      [],
    );
  },

  components: {
    Screen,
    SignForm,
    VModalCard,
  },
};
</script>
