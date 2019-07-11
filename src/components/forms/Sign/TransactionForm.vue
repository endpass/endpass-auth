<template>
  <base-form
    :request="request"
    :error="error"
    :loading="loading"
    :closable="closable"
    :is-form-valid="isFormValid"
    @cancel="emitCancel"
    @submit="emitSubmit"
  >
    <div data-test="sign-form-transaction-params">
      <form-field :label="$t('components.sign.transactionTo')">
        <p class="message ellipsis">
          {{ transaction.to }}
        </p>
      </form-field>
      <form-field :label="$t('components.sign.transactionValue')">
        <v-input
          v-model="value"
          v-validate="'required|min:0'"
          :error="errors.first('value')"
          :disabled="true"
          :data-vv-as="$t('components.sign.valueField')"
          name="value"
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
          v-validate="'required|numeric|integer|between:1,100'"
          :error="errors.first('gasPrice')"
          :data-vv-as="$t('components.sign.gasPriceField')"
          name="gasPrice"
          type="number"
          step="1"
          min="1"
          max="100"
        />
      </form-field>
      <form-field v-if="labeledGasPricesList">
        <v-content-switcher
          v-model="gasPrice"
          :items="labeledGasPricesList"
        />
      </form-field>
      <form-field :label="$t('components.sign.transactionGasLimit')">
        <v-input
          v-model="gasLimit"
          v-validate="'required|numeric|integer|between:21000,1000000'"
          :error="errors.first('gasLimit')"
          :data-vv-as="$t('components.sign.gasLimitField')"
          name="gasLimit"
          type="number"
          step="1000"
          min="21000"
          max="1000000"
        />
      </form-field>
    </div>
  </base-form>
</template>

<script>
import Web3 from 'web3';
import { mapActions } from 'vuex';
import get from 'lodash/get';
import formMixin from '@/mixins/form';
import VInput from '@endpass/ui/kit/VInput';
import VContentSwitcher from '@endpass/ui/kit/VContentSwitcher';
import FormField from '@/components/common/FormField.vue';
import BaseForm from './BaseForm.vue';

const { fromWei, hexToNumberString } = Web3.utils;

export default {
  name: 'SignTransactionForm',

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
  },

  data: () => ({
    gasPrices: null,
    value: '0',
    data: '',
    gasPrice: '0',
    gasLimit: '0',
  }),

  computed: {
    transaction() {
      return get(this.request, 'request.params[0]', null);
    },

    labeledGasPricesList() {
      if (!this.gasPrices) return null;

      return Object.keys(this.gasPrices).reduce(
        (acc, key) =>
          acc.concat({
            label: `${this.gasPrices[key]} gwei`,
            value: this.gasPrices[key].toString(),
          }),
        [],
      );
    },
  },

  methods: {
    ...mapActions(['getGasPrices', 'getGasLimitByAddress']),

    async emitSubmit({ account, password }) {
      this.$emit('submit', {
        transaction: {
          ...this.transaction,
          value: this.value,
          gas: this.gasLimit,
          gasLimit: this.gasLimit,
          gasPrice: this.gasPrice,
          data: this.data,
        },
        account,
        password,
      });
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  async mounted() {
    const { net } = this.request;
    const { to, value, gasPrice, gas, gasLimit, data } = this.transaction;
    const trxGasLimit = gas || gasLimit;

    this.gasPrices = await this.getGasPrices(net);

    if (!trxGasLimit) {
      this.gasLimit = await this.getGasLimitByAddress(to);
    } else {
      this.gasLimit = hexToNumberString(trxGasLimit);
    }

    this.value = value ? fromWei(value) : '0';
    this.gasPrice = gasPrice ? fromWei(gasPrice, 'gwei') : '1';
    this.data = data || '0x';
  },

  mixins: [formMixin],

  components: {
    BaseForm,
    VInput,
    VContentSwitcher,
    FormField,
  },
};
</script>
