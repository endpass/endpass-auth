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
    <form-field v-if="error">
      <message
        :error="true"
        data-test="error-message"
      >
        {{ error }}
      </message>
    </form-field>
    <form-field :label="$t('components.sign.yourPass')">
      <v-input
        v-model="password"
        :autofocus="true"
        type="password"
        :placeholder="$t('components.sign.enterPass')"
      />
    </form-field>
    <form-field
      v-if="requestBody"
      :label="$t('components.sign.requestdata')"
    >
      <v-code data-test="request-body">
        {{ JSON.stringify(requestBody, null, 2) }}
      </v-code>
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
        data-test="cancel-button"
        @click="emitCancel"
      >
        {{ $t('global.close') }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import get from 'lodash/get';
import VInput from '@endpass/ui/kit/VInput';
import VCode from '@/components/common/VCode.vue';
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import i18n from '@/locales/i18n';

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
  },

  data: () => ({
    password: '',
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

    primaryButtonLabel() {
      return !this.loading ? i18n.t('global.sign') : i18n.t('global.loading');
    },
  },

  methods: {
    emitSubmit() {
      if (this.password) {
        this.$emit('submit', {
          account: this.account,
          password: this.password,
        });
      }
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    VButton,
    VInput,
    VCode,
    Message,
    FormField,
    FormControls,
  },
};
</script>
