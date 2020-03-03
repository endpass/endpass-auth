<template>
  <document-create
    :types="types"
    :type-to-status="typeToStatus"
    :is-extra-loading="isExtraLoading"
    :document-type="documentType"
    @compoete="onComplete"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocumentCreate from './DocumentCreate.container';

export default {
  name: 'DocumentCreate',

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
