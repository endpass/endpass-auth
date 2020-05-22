<template>
  <doc-layout
    :is-closable="isClosable"
    @close="onCancel"
  >
    <component
      :is="currentComponent"
      :doc-types-list="docTypesList"
      :document-id="documentId"
      :status="status"
      :selected-document-type="selectedDocumentType"
      @next="onNext"
      @create="onCreate"
      @cancel="onBack"
    />
  </doc-layout>
</template>

<script>
import DocLayout from '@/components/modules/document/DocLayout';

import UploadStatus from '@/components/modules/document/DocSingleCreation/modules/UploadStatus';
import Upload from '@/components/modules/document/common/Upload';

export default {
  name: 'DocSelectedContainer',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },

    selectedDocumentType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    documentId: {
      type: String,
      required: true,
    },
  },

  computed: {
    isClosable() {
      return !this.documentId && !this.status;
    },

    currentComponent() {
      if (this.status) {
        return UploadStatus;
      }

      return Upload;
    },
  },

  methods: {
    onCreate() {
      this.$emit('create');
    },

    onNext(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this.$emit(`update:${propName}`, payload[propName]);
      });
    },

    onCancel() {
      this.$emit('cancel');
    },

    onBack() {
      this.$emit('back');
    },
  },

  components: {
    DocLayout,
  },
};
</script>
