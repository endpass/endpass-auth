<template>
  <form @submit.prevent="emitSubmit">
    <form-field v-if="message">
      <message
        :success="true"
        data-test="success-message"
      >
        {{ message }}
      </message>
    </form-field>
    <form-field v-if="error">
      <error :error="error" />
    </form-field>
    <form-field :label="$t('components.account.address')">
      <v-select
        v-model="formData.activeAccount"
        :options="accounts"
        name="activeAccount"
        data-test="active-account-select"
      />
    </form-field>
    <form-field :label="$t('components.account.activeNet')">
      <v-select
        v-model="formData.activeNet"
        :options="networks"
        name="activeNetwork"
        data-test="active-network-select"
      />
    </form-field>
    <form-field>
      <v-button
        type="button"
        :disabled="isLoading"
        :is-loading="isLoading"
        skin="primary"
        data-test="submit-button"
        fluid
        @click="emitSubmit"
      >
        {{ $t('components.account.updateAccount') }}
      </v-button>
    </form-field>
    <form-item
      v-if="isRopsten"
      class="v-mb-24"
    >
      <v-faucet-button
        :address="formData.activeAccount"
        class-name="button primary fluid"
        @before-request="emitDonateRequest"
        @donate="emitDonateSuccess"
        @donate-error="emitDonateError"
      >
        <v-button
          slot-scope="{ sendRequest, isLoading }"
          type="button"
          data-test="faucet-button"
          :disabled="isLoading"
          @click="sendRequest"
        >
          {{
            isLoading
              ? $t('components.account.requestEthLoading')
              : $t('components.account.requestEth')
          }}
        </v-button>
      </v-faucet-button>
    </form-item>
    <form-controls>
      <v-button
        :disabled="isLoading"
        type="button"
        skin="error"
        data-test="logout-button"
        @click="emitLogout"
      >
        {{ $t('global.logout') }}
      </v-button>
      <v-button
        :disabled="!isClosable || isLoading"
        type="button"
        data-test="cancel-button"
        skin="quaternary"
        @click="emitCancel"
      >
        {{ $t('global.close') }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import { VFaucetButton } from '@endpass/faucet';
import Network from '@endpass/class/Network';
import VButton from '@endpass/ui/kit/VButton';
import VSelect from '@endpass/ui/kit/VSelect';
import Message from '@/components/common/Message';
import FormField from '@/components/common/FormField';
import FormControls from '@/components/common/FormControls';
import FormItem from '@/components/common/FormItem';
import Error from '@/components/modules/Error';

export default {
  name: 'AccountForm',

  props: {
    isClosable: {
      type: Boolean,
      default: true,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },

    message: {
      type: String,
      default: null,
    },

    accounts: {
      type: Array,
      default: () => [],
    },

    networks: {
      type: Array,
      default: () => [],
    },

    formData: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isRopsten() {
      /* eslint-disable-next-line */
      return this.formData.activeNet == Network.NET_ID.ROPSTEN;
    },
  },

  methods: {
    emitSubmit() {
      if (!this.isLoading) {
        this.$emit('submit');
      }
    },

    emitLogout() {
      if (!this.isLoading) {
        this.$emit('logout');
      }
    },

    emitCancel() {
      if (this.isClosable) {
        this.$emit('cancel');
      }
    },

    emitDonateRequest() {
      this.$emit('donate-request');
    },

    emitDonateSuccess(e) {
      this.$emit('donate-success', e);
    },

    emitDonateError(e) {
      if (e.message.includes('403')) {
        this.$emit(
          'donate-error',
          this.$i18n.t('components.account.donationError'),
        );
      }
    },
  },

  components: {
    Error,
    FormItem,
    VFaucetButton,
    VButton,
    VSelect,
    Message,
    FormField,
    FormControls,
  },
};
</script>
