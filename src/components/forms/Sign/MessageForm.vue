<template>
  <base-form
    :request="request"
    :error="error"
    :is-loading="isLoading"
    :is-closable="isClosable"
    :is-form-valid="isFormValid"
    :title="$t('components.sign.requiresSignBy')"
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
import get from 'lodash/get';
import { hexToUtf8 } from 'web3-utils';
import formMixin from '@/mixins/form';
import FormField from '@/components/common/FormField.vue';
import BaseForm from './BaseForm.vue';

export default {
  name: 'SignMessageForm',

  props: {
    isLoading: {
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

    isClosable: {
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

      try {
        return hexToUtf8(hexMessage);
      } catch (e) {
        return hexMessage;
      }
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
