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
    <!-- <form-field v-if="error">
      <message
        :error="true"
        data-test="error-message"
      >
        {{ error }}
      </message>
    </form-field> -->
    <form-field :label="$t('components.sign.yourPass')">
      <v-input
        v-model="password"
        :placeholder="$t('components.sign.enterPass')"
        :error="error"
        type="password"
      />
    </form-field>
    <template v-if="requestBody && isTransaction">
      <form-field label="Value">
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
      <form-field v-if="gasPrices">
        <v-content-switcher
          v-model="gasPrice"
          :items="gasPrices"
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
    </template>
    <form-field
      v-else-if="requestBody && !isTransaction"
      :label="$t('components.sign.requestMessage')"
    >
      {{ requestMessage }}
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
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VContentSwitcher from '@endpass/ui/kit/VContentSwitcher';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

const { hexToUtf8, fromWei } = Web3.utils;

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

    gasPrices: {
      type: Array,
      default: null,
    },

    isTransaction: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    password: '',
    value: 0,
    data: '',
    gasPrice: 0,
    gasLimit: 21000,
  }),

  computed: {
    account() {
      return get(this.request, 'address');
    },

    requesterUrl() {
      return get(this.request, 'url');
    },

    requestBody() {
      return get(this.request, 'request');
    },

    requestMessage() {
      return hexToUtf8(this.requestBody.params[1]);
    },

    requestTransaction() {
      return this.requestBody.params[0];
    },

    transactionValue() {
      if (!this.requestTransaction) return 0;

      return fromWei(this.requestTransaction.value);
    },

    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.sign')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    emitSubmit() {
      if (this.password) return;

      this.$emit('submit', {
        account: this.account,
        password: this.password,
        transaction: {
          value: this.value,
          data: this.data,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit,
        },
      });
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  mounted() {
    if (!this.isTransaction) return;

    this.value = fromWei(this.requestTransaction.value);
    this.gasPrice = fromWei(this.requestTransaction.gasPrice);
    this.data = this.requestTransaction.data;
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
