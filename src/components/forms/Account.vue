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
      <message
        :error="true"
        data-test="error-message"
      >
        {{ error }}
      </message>
    </form-field>
    <form-field :label="$t('components.account.address')">
      <v-select
        v-model="formData.activeAccount"
        :items="accounts"
        name="activeAccount"
      />
    </form-field>
    <form-field :label="$t('components.account.activeNet')">
      <v-select
        v-model="formData.activeNet"
        :items="networks"
        name="activeNetwork"
      />
    </form-field>
    <form-field>
      <v-button
        :submit="true"
        :disabled="loading"
        type="primary"
        data-test="submit-button"
        fluid
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-field>
    <v-faucet-button
      v-if="isRopsten"
      :address="formData.activeAccount"
      class-name="button primary fluid"
      @before-request="emitDonateRequest"
      @donate="emitDonateSuccess"
      @donate-error="emitDonateError"
    >
      {{ $t('components.account.requestEth') }}
    </v-faucet-button>
    <form-controls>
      <v-button
        :disabled="loading || !canLogout"
        type="danger"
        data-test="logout-button"
        @click="emitLogout"
      >
        {{ $t('global.logout') }}
      </v-button>
      <v-button
        :disabled="!closable || loading"
        data-test="cancel-button"
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
import VButton from '@/components/common/VButton.vue';
import VSelect from '@/components/common/VSelect.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

export default {
  name: 'AccountForm',

  props: {
    closable: {
      type: Boolean,
      default: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    canLogout: {
      type: Boolean,
      default: true,
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
    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('components.account.updateAccount')
        : this.$i18n.t('global.loading');
    },

    isRopsten() {
      /* eslint-disable-next-line */
      return this.formData.activeNet == Network.NET_ID.ROPSTEN;
    },
  },

  methods: {
    emitSubmit() {
      if (!this.loading) {
        this.$emit('submit');
      }
    },

    emitLogout() {
      if (!this.loading) {
        this.$emit('logout');
      }
    },

    emitCancel() {
      if (this.closable) {
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
    VFaucetButton,
    VButton,
    VSelect,
    Message,
    FormField,
    FormControls,
  },
};
</script>
