<template>
  <form data-test="sign-form">
    <form-field v-if="error">
      <message :error="true" data-test="account-address">
        {{ error }}
      </message>
    </form-field>
    <form-field v-if="requesterUrl">
      <a :href="requesterUrl" data-test="requester-url">{{ requesterUrl }}</a>
      {{ $t('components.sign.requestSign') }}
    </form-field>
    <form-field :label="$t('components.sign.requiresSignBy')">
      <message :ellipsis="true" data-test="account-address">
        {{ account }}
      </message>
    </form-field>
    <form-field :label="$t('components.sign.yourPass')">
      <v-input
        v-model="password"
        v-validate.immediate="'required|min:8'"
        :placeholder="$t('components.sign.enterPass')"
        :error="errors.firstById('invalidPassword')"
        name="password"
        type="password"
      />
    </form-field>
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
          :disabled="true"
          name="value"
          type="number"
        />
      </form-field>
      <form-field v-if="data" :label="$t('components.sign.transactionData')">
        <v-input v-model="data" :disabled="true" />
      </form-field>
      <form-field :label="$t('components.sign.transactionGasPrice')">
        <v-input
          v-model="gasPrice"
          v-validate="'required|min:0'"
          name="gasPrice"
          type="number"
          min="0"
          step="1"
        />
      </form-field>
      <form-field v-if="labeledGasPricesList">
        <v-content-switcher
          v-model="gasPrice"
          v-validate="'required|min:0'"
          :items="labeledGasPricesList"
        />
      </form-field>
      <form-field :label="$t('components.sign.transactionGasLimit')">
        <v-input v-model="gasLimit" name="gasLimit" type="number" min="0" />
      </form-field>
    </div>
    <form-controls>
      <v-button
        :disabled="!closable || loading"
        skin="quaternary"
        type="button"
        data-test="cancel-button"
        @click="emitCancel"
      >
        {{ $t('global.close') }}
      </v-button>
      <v-button
        :disabled="loading || !isFormValid"
        type="button"
        data-test="submit-button"
        @click="emitSubmit"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import Web3 from 'web3';
import { mapActions } from 'vuex';
import get from 'lodash/get';
import { setWeb3Network } from '@/service/web3';
import formMixin from '@/mixins/form';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VContentSwitcher from '@endpass/ui/kit/VContentSwitcher';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

const { fromWei } = Web3.utils;

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
    password: '',
    value: '0',
    data: '',
    gasPrice: '0',
    gasLimit: '0',
  }),

  computed: {
    account() {
      return get(this.request, 'address');
    },

    network() {
      return get(this.request, 'net');
    },

    requesterUrl() {
      return get(this.request, 'url');
    },

    transaction() {
      const trx = get(this.request, 'request.params[0]');

      if (!trx) return null;

      return trx;
    },

    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.sign')
        : this.$i18n.t('global.loading');
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

  watch: {
    password() {
      if (this.errors.has('password')) {
        this.errors.removeById('invalidPassword');
      }
    },
  },

  methods: {
    ...mapActions(['getGasPrice', 'getGasLimitByAddress', 'validatePassword']),

    async emitSubmit() {
      if (!this.isFormValid) return;

      const isPasswordValid = await this.validatePassword({
        address: this.account,
        password: this.password,
      });

      if (!isPasswordValid) {
        this.errors.add({
          id: 'invalidPassword',
          field: 'password',
          msg: this.$t('store.auth.passwordIncorrect'),
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

    const { net } = this.request;
    const { to, value, gasPrice, gas, gasLimit, data } = this.transaction;

    this.gasPrices = await this.getGasPrice(net);
    this.gasLimit = gas || gasLimit;

    if (!gasLimit) {
      this.gasLimit = await this.getGasLimitByAddress(to);
    }

    this.value = value ? fromWei(value) : '0';
    this.gasPrice = gasPrice ? fromWei(gasPrice, 'gwei') : '0';
    this.data = data || '';
  },

  mixins: [formMixin],

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
