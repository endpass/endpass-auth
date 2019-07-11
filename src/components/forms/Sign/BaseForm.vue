<template>
  <div data-test="sign-form">
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
        v-validate="'required|min:8'"
        :placeholder="$t('components.sign.enterPass')"
        :error="errors.first('password')"
        :data-vv-as="$t('components.sign.passwordField')"
        name="password"
        type="password"
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
import { mapActions } from 'vuex';
import { setWeb3Network } from '@/service/web3';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

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

    isFormValid: {
      type: Boolean,
      default: false,
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
    ...mapActions(['validatePassword']),

    async emitSubmit() {
      if (!this.isFormValid) return;

      try {
        await this.validatePassword({
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
    await setWeb3Network(this.network);
  },

  components: {
    VButton,
    VInput,
    Message,
    FormField,
    FormControls,
  },
};
</script>
