<template>
  <base-form
    :request="request"
    :error="error"
    :loading="loading"
    :closable="closable"
    :is-form-valid="isFormValid"
    @cancel="emitCancel"
    @submit="emitSubmit"
  >
    <form-field
      v-if="message"
      :label="$t('components.sign.requestMessage')"
      data-test="sign-form-message"
    >
      {{ message }}
    </form-field>
  </base-form>
</template>

<script>
import Web3 from 'web3';
import get from 'lodash/get';
import formMixin from '@/mixins/form';
import FormField from '@/components/common/FormField.vue';
import BaseForm from './BaseForm.vue';

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

  computed: {
    message() {
      const method = get(this.request, 'request.method');
      const hexMessage =
        method === 'personal_sign'
          ? get(this.request, 'request.params[0]')
          : get(this.request, 'request.params[1]');

      if (!hexMessage) return null;

      return hexToUtf8(hexMessage);
    },
  },

  methods: {
    async emitSubmit(payload) {
      this.$emit('submit', payload);
    },

    emitCancel() {
      this.$emit('cancel');
    },
  },

  mixins: [formMixin],

  components: {
    FormField,
    BaseForm,
  },
};
</script>
