<template>
  <form
    data-test="sign-form"
    @submit.prevent="emitSubmit"
  >
    <form-field v-if="requesterUrl">
      <a
        :href="requesterUrl"
        data-test="requester-url"
      >{{ requesterUrl }}</a>
      {{ $t('components.sign.requestSign') }}
    </form-field>
    <form-field :label="$t('components.sign.requiresSignBy')">
      <message
        :ellipsis="true"
        data-test="account-address"
      >
        {{ account }}
      </message>
    </form-field>
    <form-field :label="$t('components.sign.yourPass')">
      <v-input
        v-model="password"
        :placeholder="$t('components.sign.enterPass')"
        :error="error"
        type="password"
      />
    </form-field>
    <div
      v-if="isTransaction"
      data-test="sign-form-transaction-params"
    >
      <form-field :label="$t('components.sign.transactionTo')">
        <p class="message ellipsis">
          {{ transaction.to }}
        </p>
      </form-field>
      <form-field :label="$t('components.sign.transactionValue')">
        <v-input
          v-model="value"
          :disabled="true"
          type="number"
        />
      </form-field>
      <form-field
        v-if="data"
        :label="$t('components.sign.transactionData')"
      >
        <v-input
          v-model="data"
          :disabled="true"
        />
      </form-field>
      <form-field :label="$t('components.sign.transactionGasPrice')">
        <v-input
          v-model="gasPrice"
          type="number"
        />
      </form-field>
      <form-field v-if="labeledGasPricesList">
        <v-content-switcher
          v-model="gasPrice"
          :items="labeledGasPricesList"
          step="0.0000000001"
          min="0"
        />
      </form-field>
      <form-field :label="$t('components.sign.transactionGasLimit')">
        <v-input
          v-model="gasLimit"
          type="number"
          min="0"
        />
      </form-field>
    </div>
    <form-field
      v-else-if="message"
      :label="$t('components.sign.requestMessage')"
      data-test="sign-form-message"
    >
      {{ message }}
    </form-field>
    <form-controls>
      <v-button
        :disabled="loading || !password"
        :submit="true"
        type="primary"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
      <v-button
        :disabled="!closable || loading"
        skin="quaternary"
        data-test="cancel-button"
        @click="emitCancel"
      >
        {{ $t('global.close') }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import Web3 from 'web3';
import get from 'lodash/get';
import { mapGetters } from 'vuex';
import { web3, setWeb3Network } from '@/service/web3';
import { transactionInEth } from '@/util/transaction';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VContentSwitcher from '@endpass/ui/kit/VContentSwitcher';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

const { hexToUtf8 } = Web3.utils;

export default {
  name: 'SignForm',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },

    request: {
      type: Object,
      default: null,
    },

    closable: {
      type: Boolean,
      default: true,
    },

    isTransaction: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    password: '',
    value: '0',
    data: '',
    gasPrice: '0',
    gasLimit: '0',
  }),

  computed: {
    ...mapGetters(['labeledGasPricesList']),

    account() {
      return get(this.request, 'address');
    },

    network() {
      return get(this.request, 'net');
    },

    requesterUrl() {
      return get(this.request, 'url');
    },

    message() {
      const method = get(this.request, 'request.method');
      const hexMessage =
        method === 'personal_sign'
          ? get(this.request, 'request.params[0]')
          : get(this.request, 'request.params[1]');

      if (!hexMessage) return null;

      return hexToUtf8(hexMessage);
    },

    transaction() {
      const trx = get(this.request, 'request.params[0]');

      if (!trx) return null;

      return transactionInEth(trx);
    },

    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.sign')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    async getInitialGasLimit(address) {
      const code = await web3.eth.getCode(address);

      if (code === '0x') {
        return '21000';
      }

      return '200000';
    },

    emitSubmit() {
      if (!this.password) return;

      if (!this.isTransaction) {
        this.$emit('submit', {
          account: this.account,
          password: this.password,
        });
        return;
      }

      this.$emit('submit', {
        account: this.account,
        password: this.password,
        transaction: {
          ...this.transaction,
          value: this.value,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
          data: this.data,
        },
      });
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  async mounted() {
    setWeb3Network(this.network);

    if (!this.isTransaction) return;

    const { to, value, gasPrice, gasLimit, data } = this.transaction;

    if (!gasLimit || gasLimit === '0') {
      this.gasLimit = await this.getInitialGasLimit(to);
    } else {
      this.gasLimit = gasLimit;
    }

    this.value = value;
    this.gasPrice = gasPrice;
    this.data = data || '';
  },

  components: {
    VButton,
    VInput,
    VContentSwitcher,
    Message,
    FormField,
    FormControls,
  },
};
</script>
