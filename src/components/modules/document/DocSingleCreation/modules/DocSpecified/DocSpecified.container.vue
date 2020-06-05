<template>
  <doc-layout
    :is-closable="isClosable"
    @close="onCancelUploadSpecified"
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

import UploadStatus from '../UploadStatus';
import UploadSingle from '../UploadSingle';
import DocTypesList from './modules/DocTypesList';

export default {
  name: 'DocSpecifiedContainer',

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
      switch (true) {
        case !this.documentId && !this.selectedDocumentType:
          return DocTypesList;

        case !!this.status:
          return UploadStatus;

        default:
          return UploadSingle;
      }
    },
  },

  methods: {
    onCreate() {
      this.$emit('create', { documentId: this.documentId });
    },

    onNext(payload) {
      this.$emit('update', payload);
    },

    onCancelUploadSpecified() {
      this.$emit('cancel');
    },

    onBack() {
      this.$emit('update', { selectedDocumentType: '' });
    },
  },

  components: {
    DocLayout,
  },
};
</script>
