<template>
  <div data-test="sign-form">
    <form-field v-if="error">
      <message
        :error="true"
        data-test="base-form-error"
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
    <form-field :label="title">
      <v-address
        :address="account"
        data-test="account-address"
      />
    </form-field>
    <form-field :label="$t('components.sign.yourPass')">
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        :placeholder="$t('components.sign.enterPass')"
        :error="errors.first('password')"
        :data-vv-as="$t('components.sign.passwordField')"
        name="password"
        type="password"
        data-test="password-input"
      />
    </form-field>
    <slot />
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
  </div>
</template>

<script>
import get from 'lodash/get';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import signer from '@/class/singleton/signer';
import Message from '@/components/common/Message.vue';
import VAddress from '@/components/common/VAddress.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import { accountsStore } from '@/store';

export default {
  name: 'SignBaseForm',

  inject: ['$validator'],

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

    title: {
      type: String,
      default: null,
    },

    isFormValid: {
      type: Boolean,
      default: false,
    },
  },

  accountsStore,

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

    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.sign')
        : this.$i18n.t('global.loading');
    },
  },

  watch: {
    password() {
      if (this.errors.firstById('incorrectPassword')) {
        this.errors.removeById('incorrectPassword');
      }
    },
  },

  methods: {
    async emitSubmit() {
      if (!this.isFormValid) return;

      try {
        await this.$options.accountsStore.validatePassword({
          address: this.account,
          password: this.password,
        });
        this.$emit('submit', {
          account: this.account,
          password: this.password,
        });
      } catch (err) {
        this.errors.add({
          id: 'incorrectPassword',
          field: 'password',
          msg: err.message,
        });
      }
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  async mounted() {
    this.$validator.resume();
    await signer.setWeb3Network(this.network);
  },

  beforeDestroy() {
    this.$validator.pause();
  },

  components: {
    VButton,
    VInput,
    Message,
    FormField,
    FormControls,
    VAddress,
  },
};
</script>
