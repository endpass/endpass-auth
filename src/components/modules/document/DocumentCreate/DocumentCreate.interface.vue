<template>
  <document-create
    :types="types"
    :type-to-status="typeToStatus"
    :is-extra-loading="isExtraLoading"
    :document-type="documentType"
    @complete="onComplete"
    @create="onCreate"
    @cancel="onCancel"
    @close="onClose"
  />
</template>

<script>
import DocumentCreate from './DocumentCreate.container';

export default {
  name: 'DocumentCreateInterface',

  props: {
    documentType: {
      type: String,
      default: '',
    },

    typeToStatus: {
      type: Object,
      default: () => ({}),
    },

    types: {
      type: Array,
      required: true,
    },

    isExtraLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onComplete(payload) {
      this.updateProps(payload);
    },

    updateProps(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this.$emit(`update:${propName}`, payload[propName]);
      });
    },

    onClose() {
      this.$emit('close');
    },

    onCancel() {
      this.$emit('cancel');
    },

    onCreate(documentId) {
      this.$emit('create', documentId);
    },
  },

  components: {
    DocumentCreate,
  },
};
</script>
