<template>
  <form data-test="sign-form" @submit.prevent="emitSubmit">
    <form-field v-if="requesterUrl">
      <a :href="requesterUrl" data-test="requester-url">{{ requesterUrl }}</a>
      requests sign action.
    </form-field>
    <form-field label="Requires request sign by:">
      <message :ellipsis="true" data-test="account-address">
        {{ account }}
      </message>
    </form-field>
    <form-field v-if="error">
      <message :error="true" data-test="error-message">{{ error }}</message>
    </form-field>
    <form-field label="Your account password:">
      <v-input
        v-model="password"
        :autofocus="true"
        type="password"
        placeholder="Enter your password..."
      />
    </form-field>
    <form-field v-if="requestBody" label="Request data:">
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
        >{{ primaryButtonLabel }}</v-button
      >
      <v-button
        :disabled="!closable || loading"
        data-test="cancel-button"
        @click="emitCancel"
        >Close</v-button
      >
    </form-controls>
  </form>
</template>

<script>
import { get } from 'lodash';
import VInput from '@/components/common/VInput.vue';
import VSelect from '@/components/common/VSelect.vue';
import VCode from '@/components/common/VCode.vue';
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

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
      return !this.loading ? 'Sign' : 'Loading...';
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
    VSelect,
    VCode,
    Message,
    FormField,
    FormControls,
  },
};
</script>
