<template>
  <doc-layout
    :is-closable="isClosable"
    :is-returnable="isReturnable"
    @return="onReturn"
    @close="onCancel"
  >
    <component
      :is="currentComponent"
      :document-id="documentId"
      :doc-type-to-status="docTypeToStatus"
      :selected-document-type="selectedDocumentType"
      :doc-required-types-list="docRequiredTypesList"
      :is-available-to-apply="isAvailableToApply"
      :selected-documents-by-type="selectedDocumentsByType"
      :available-documents-list="availableDocumentsList"
      @next="onNext"
      @create="onCreate"
      @cancel="onBack"
    />
  </doc-layout>
</template>

<script>
import DocLayout from '@/components/modules/document/DocLayout';
import LoadingScreen from '@/components/common/LoadingScreen';

import Upload from './modules/UploadRequired';
import UploadStatus from './modules/UploadStatus';
import RequiredDocumentTypes from './modules/RequiredDocumentTypes';
import SelectedDocumentByType from './modules/SelectedDocumentByType';

export default {
  name: 'DocRequiredCreationContainer',

  props: {
    docRequiredTypesList: {
      type: Array,
      required: true,
    },

    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
      required: true,
    },

    availableDocumentsList: {
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
      currentComponent: 'required-document-types',
    };
  },

  computed: {
    isClosable() {
      return !this.documentId && !this.status;
    },

    isDocumentsByTypeExists() {
      const docBySelectedType = this.availableDocumentsList.find(
        document => document.documentType === this.selectedDocumentType,
      );

      return !!docBySelectedType;
    },

    isReturnable() {
      switch (true) {
        case this.currentComponent === 'selected-document-by-type':
          return true;

        default:
          return false;
      }
    },
  },

  watch: {
    isStatusesVerified: {
      handler(isAllVerified) {
        if (
          isAllVerified &&
          this.currentComponent === 'required-document-types'
        ) {
          this.currentComponent = 'upload-status';
        }
      },
      immediate: true,
    },
  },

  methods: {
    onReturn() {
      if (!this.isReturnable) return;
      switch (true) {
        case this.currentComponent === 'selected-document-by-type':
          this.currentComponent = 'required-document-types';
          break;

        default:
          break;
      }
    },

    onCancel() {
      this.$emit('cancel');
    },

    onCreate() {
      // TODO: rename it to `finish`, not `create`
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
        case this.currentComponent === 'required-document-types' &&
          this.isDocumentsByTypeExists:
          this.currentComponent = 'selected-document-by-type';
          break;

        case this.currentComponent === 'required-document-types' &&
          !this.isDocumentsByTypeExists:
          this.currentComponent = 'upload';
          break;

        case this.currentComponent === 'selected-document-by-type' &&
          this.documentId:
          this.currentComponent = 'required-document-types';
          break;

        case this.currentComponent === 'selected-document-by-type' &&
          !this.documentId:
          this.currentComponent = 'upload';
          break;

        case this.currentComponent === 'upload' && !this.isStatusesAppropriated:
        case this.currentComponent === 'upload-status':
          this.$emit('update:selectedDocumentType', '');
          this.$emit('update:documentId', '');
          this.$emit('update:status', '');
          this.currentComponent = 'required-document-types';
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
        this.currentComponent = 'required-document-types';
      }
    },
  },

  components: {
    LoadingScreen,
    DocLayout,
    RequiredDocumentTypes,
    SelectedDocumentByType,
    Upload,
    UploadStatus,
  },
};
</script>
