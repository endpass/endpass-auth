<template>
  <form data-test="sign-form" @submit.prevent="emitSubmit">
    <form-field v-if="requesterUrl">
      Please apply connect to
      <a :href="requesterUrl" data-test="requester-url">{{ requesterUrl }}</a>
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
import VInput from '@/components/common/VInput.vue';
import VSelect from '@/components/common/VSelect.vue';
import VCode from '@/components/common/VCode.vue';
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

import { ORIGIN_HOST } from '@/constants';

export default {
  name: 'SignHost',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
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
    requesterUrl() {
      return ORIGIN_HOST;
    },

    primaryButtonLabel() {
      return !this.loading ? 'Sign' : 'Loading...';
    },
  },

  methods: {
    emitSubmit() {
      if (this.password) {
        this.$emit('submit', {
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
