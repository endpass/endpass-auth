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
    <template v-if="isTransaction">
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
    </template>
    <form-field
      v-else-if="message"
      :label="$t('components.sign.message')"
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
    ...mapGetters(['labeledGasPricesList']),

    account() {
      return get(this.request, 'address');
    },

    requesterUrl() {
      return get(this.request, 'url');
    },

    message() {
      const hexMessage = get(this.request, 'request.params[1]');

      if (!hexMessage) return null;

      return hexToUtf8(hexMessage);
    },

    transaction() {
      return get(this.request, 'request.params[0]');
    },

    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.sign')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    emitSubmit() {
      if (!this.password) return;

      if (!this.isTransaction) {
        this.$emit('submit', {
          account: this.account,
          password: this.password,
        });
        return;
      }

      const updatedTransaction = {
        ...this.transaction,
        value: this.value,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
      };

      if (this.data) {
        Object.assign(updatedTransaction, {
          data: this.data,
        });
      }

      this.$emit('submit', {
        account: this.account,
        password: this.password,
        transaction: updatedTransaction,
      });
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  mounted() {
    if (!this.isTransaction) return;

    this.value = fromWei(this.transaction.value);
    this.gasPrice = fromWei(this.transaction.gasPrice);
    this.data = this.transaction.data;
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
