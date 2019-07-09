<template>
  <form data-test="sign-form">
    <form-field v-if="error">
      <message
        :error="true"
        data-test="account-address"
      >
        {{ error }}
      </message>
    </form-field>
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
        v-validate.immediate="'required|min:8'"
        :placeholder="$t('components.sign.enterPass')"
        :error="errors.firstById('invalidPassword')"
        name="password"
        type="password"
      />
    </form-field>
    <form-field
      v-if="message"
      :label="$t('components.sign.requestMessage')"
      data-test="sign-form-message"
    >
      {{ message }}
    </form-field>
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
import get from 'lodash/get';
import { mapActions } from 'vuex';
import { setWeb3Network } from '@/service/web3';
import formMixin from '@/mixins/form';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

const { hexToUtf8 } = Web3.utils;

export default {
  name: 'SignMessageForm',

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
    password: '',
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

    message() {
      const method = get(this.request, 'request.method');
      const hexMessage =
        method === 'personal_sign'
          ? get(this.request, 'request.params[0]')
          : get(this.request, 'request.params[1]');

      if (!hexMessage) return null;

      return hexToUtf8(hexMessage);
    },

    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.sign')
        : this.$i18n.t('global.loading');
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
    ...mapActions(['validatePassword']),

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
      });
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  async mounted() {
    setWeb3Network(this.network);
  },

  mixins: [formMixin],

  components: {
    VButton,
    VInput,
    Message,
    FormField,
    FormControls,
  },
};
</script>
