<template>
  <base-form
    :request="request"
    :error="error"
    :is-loading="isLoading"
    :is-closable="isClosable"
    :is-form-valid="isFormValid"
    :title="$t('components.sign.requiresPaymentBy')"
    @cancel="emitCancel"
    @submit="emitSubmit"
  >
    <div data-test="sign-form-transaction-params">
      <form-field :label="$t('components.sign.transactionTo')">
        <v-address :address="transaction.to" />
      </form-field>
      <div class="sign-transaction-form-values">
        <form-field
          key="trxValue"
          :label="$t('components.sign.transactionValue')"
        >
          <v-input
            v-model="valueToDisplay"
            v-validate="`required|between:0,${maxAmount}`"
            :error="errors.first('value')"
            :disabled="true"
            :data-vv-as="$t('components.sign.valueField')"
            name="value"
            type="number"
            data-test="value-input"
          />
        </form-field>
        <form-field
          :label="
            $t('components.sign.transactionValueFiat', {
              currency: fiatCurrency,
            })
          "
        >
          <v-input
            v-model="valueInFiat"
            :disabled="true"
            name="value"
            type="number"
            data-test="value-fiat-input"
          />
        </form-field>
      </div>
      <form-field>
        <button
          class="sign-transaction-form-toggler"
          type="button"
          data-test="advanced-settings-toggle"
          @click="handleToggleAdvancedSettings"
        >
          {{ advancedSettingsTogglerLabel }}
        </button>
      </form-field>
      <div v-show="isAdvancedOptionsVisible">
        <form-field
          v-if="data"
          :label="$t('components.sign.transactionData')"
        >
          <v-input
            v-model="data"
            :disabled="true"
            data-test="data-input"
          />
        </form-field>
        <form-field
          key="gasPrice"
          :label="$t('components.sign.transactionGasPrice')"
        >
          <v-input
            v-model="gasPrice"
            v-validate="'required|between:1,100'"
            :error="errors.first('gasPrice')"
            :data-vv-as="$t('components.sign.gasPriceField')"
            name="gasPrice"
            type="number"
            step="1"
            min="1"
            max="100"
            data-test="gas-price-input"
          />
        </form-field>
        <form-field
          v-if="labeledGasPricesList"
          :label="$t('components.sign.transactionPriority')"
        >
          <v-content-switcher
            v-model="gasPrice"
            :items="labeledGasPricesList"
          />
        </form-field>
        <form-field
          key="gasLimit"
          :label="$t('components.sign.transactionGasLimit')"
        >
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
            data-test="gas-limit-input"
          />
        </form-field>
      </div>
    </div>
  </base-form>
</template>

<script>
import { BigNumber } from 'bignumber.js';
import get from 'lodash/get';
import VInput from '@endpass/ui/kit/VInput';
import VContentSwitcher from '@endpass/ui/kit/VContentSwitcher';
import { fromWei, toWei, hexToNumberString } from 'web3-utils';
import formMixin from '@/mixins/form';
import FormField from '@/components/common/FormField.vue';
import VAddress from '@/components/common/VAddress.vue';
import BaseForm from './BaseForm.vue';
import { accountsStore, gasPriceStore } from '@/store';

export default {
  name: 'SignTransactionForm',

  props: {
    isLoading: {
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

    isClosable: {
      type: Boolean,
      default: true,
    },
  },

  gasPriceStore,
  accountsStore,

  data: () => ({
    gasPrices: null,
    value: '0',
    data: '',
    gasPrice: '0',
    gasLimit: '0',
    ethPrice: '0',
    isAdvancedOptionsVisible: false,
    isInited: false,
  }),

  computed: {
    settings() {
      return this.$options.accountsStore.settings;
    },

    balance() {
      return this.$options.accountsStore.balance;
    },

    maxAmount() {
      const { balance, gasPrice, gasLimit } = this;
      if (!this.isInited || !balance || balance === '0') return '0';
      const balanceBN = BigNumber(balance);
      const gasFeeBN = BigNumber(toWei(gasPrice, 'gwei')).times(gasLimit);
      const maxAmountBN = balanceBN.minus(gasFeeBN);
      const maxAmount = fromWei(maxAmountBN.toFixed());
      return maxAmount > 0 ? maxAmount : 0;
    },

    transaction() {
      return get(this.request, 'request.params[0]', null);
    },

    labeledGasPricesList() {
      if (!this.gasPrices) return null;

      return Object.keys(this.gasPrices).reduce((acc, key) => {
        const priority = key.charAt(0).toUpperCase() + key.slice(1);

        return acc.concat({
          label: `${priority} (${this.gasPrices[key]} gwei)`,
          value: this.gasPrices[key].toString(),
        });
      }, []);
    },

    advancedSettingsTogglerLabel() {
      if (this.isAdvancedOptionsVisible) {
        return this.$t('components.sign.closeAdvancedSettings');
      }

      return this.$t('components.sign.openAdvancedSettings');
    },

    fiatCurrency() {
      return get(this.settings, 'fiatCurrency', 'USD');
    },

    valueToDisplay() {
      return BigNumber(this.value).toFixed(6);
    },

    valueInFiat() {
      return BigNumber(this.value)
        .times(this.ethPrice)
        .toFixed(2);
    },
  },

  methods: {
    handleToggleAdvancedSettings() {
      this.isAdvancedOptionsVisible = !this.isAdvancedOptionsVisible;
    },

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

  created() {
    this.$options.accountsStore.subscribeOnBalanceUpdates();
  },

  async mounted() {
    const { net } = this.request;
    const { to, value, gasPrice, gas, gasLimit, data } = this.transaction;
    const trxGasLimit = gas || gasLimit;

    this.ethPrice = await this.$options.gasPriceStore.getEtherPrice(
      this.fiatCurrency,
    );
    this.gasPrices = await this.$options.gasPriceStore.getGasPrices(net);

    if (!trxGasLimit) {
      this.gasLimit = await this.$options.gasPriceStore.getGasLimitByAddress(
        to,
      );
    } else {
      this.gasLimit = hexToNumberString(trxGasLimit);
    }

    this.value = value ? fromWei(value, 'ether') : '0';
    this.gasPrice = gasPrice ? fromWei(gasPrice, 'gwei') : '1';
    this.data = data || '0x';
    this.isInited = true;
  },

  mixins: [formMixin],

  components: {
    BaseForm,
    VInput,
    VContentSwitcher,
    VAddress,
    FormField,
  },
};
</script>

<style lang="postcss">
.sign-transaction-form-values {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & > * {
    flex: 0 0 calc(50% - 10px);
    margin-bottom: 0;
  }

  & > *:first-child {
    margin-right: 20px;
  }
}

.sign-transaction-form-toggler {
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  text-decoration: underline;
  border: none;
  background: none;
  cursor: pointer;
  color: #044bda;
  outline: none;
  transition: color 0.25s;

  &:focus {
    color: #0029b0;
  }
}
</style>
