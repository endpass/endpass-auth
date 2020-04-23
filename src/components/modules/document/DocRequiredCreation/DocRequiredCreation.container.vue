<template>
  <doc-layout
    :is-closable="isClosable"
    @close="handleCancel"
  >
    <component
      :is="currentComponent"
      :document-id="documentId"
      :doc-type-to-status="docTypeToStatus"
      :doc-types-list="docTypesList"
      :selected-document-type="selectedDocumentType"
      :is-show-status="true"
      @next="onNext"
      @create="onCreate"
      @cancel="onBack"
    />
  </doc-layout>
</template>

<script>
import DocLayout from '@/components/modules/document/DocLayout';

import UploadStatus from '@/components/modules/document/DocRequiredCreation/modules/UploadStatus';
import DocumentTypes from '@/components/modules/document/common/DocumentTypes';
import LoadingScreen from '@/components/common/LoadingScreen';
import Upload from './modules/UploadRequired';

export default {
  name: 'DocRequiredCreationContainer',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },

    docTypeToStatus: {
      type: Object,
      required: true,
    },

    isStatusesAppropriated: {
      type: Boolean,
      required: true,
    },

    isStatusesVerified: {
      type: Boolean,
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

  data() {
    return {
      currentComponent: 'document-types',
    };
  },

  computed: {
    isClosable() {
      return !this.documentId && !this.status;
    },
  },

  watch: {
    isStatusesVerified: {
      handler(isAllVerified) {
        if (isAllVerified && this.currentComponent === 'document-types') {
          this.currentComponent = 'upload-status';
        }
      },
      immediate: true,
    },
  },

  methods: {
    handleCancel() {
      this.$emit('cancel');
    },

    onCreate() {
      this.$emit('create');
    },

    updateProps(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this.$emit(`update:${propName}`, payload[propName]);
      });
    },

    async onNext(payload) {
      this.updateProps(payload);

      await this.$nextTick();

      this.openNextScreen();
    },

    openNextScreen() {
      switch (true) {
        case this.currentComponent === 'document-types':
          this.currentComponent = 'upload';
          break;

        case this.currentComponent === 'upload' && !this.isStatusesAppropriated:
        case this.currentComponent === 'upload-status':
          this.$emit('update:selectedDocumentType', '');
          this.$emit('update:documentId', '');
          this.$emit('update:status', '');
          this.currentComponent = 'document-types';
          break;

        case this.currentComponent === 'upload':
          this.currentComponent = 'upload-status';
          break;

        default:
          throw new Error(
            'Wrong next case with document required types upload',
          );
      }
    },

    onBack() {
      if (this.currentComponent === 'upload') {
        this.currentComponent = 'document-types';
      }
    },
  },

  components: {
    LoadingScreen,
    DocLayout,
    DocumentTypes,
    Upload,
    UploadStatus,
  },
};
</script>
