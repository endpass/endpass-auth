<template>
  <doc-layout
    :is-closable="isClosable"
    :is-returnable="isReturnAvailable"
    @return="onReturn"
    @close="onCancelSelectionRequired"
  >
    <component
      :is="currentComponent"
      :selected-document-type="selectedDocumentType"
      :doc-required-types-list="docRequiredTypesList"
      :is-available-to-finish="isAvailableToFinish"
      :is-all-doc-required-types-verified="isAllDocRequiredTypesVerified"
      :selected-documents-by-type="selectedDocumentsByType"
      :available-documents-list="availableDocumentsList"
      @start-upload="onStartUpload"
      @next="onNext"
      @finish="handleFinishSelectionRequired"
      @cancel="handleBack"
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
    isReturnable: {
      type: Boolean,
      required: true,
    },

    docRequiredTypesList: {
      type: Array,
      required: true,
    },

    isAvailableToFinish: {
      type: Boolean,
      required: true,
    },

    isAllDocRequiredTypesVerified: {
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

    selectedDocumentType: {
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
      return (
        this.currentComponent === 'required-document-types' ||
        this.currentComponent === 'selected-document-by-type'
      );
    },

    isDocumentsByTypeExists() {
      const docBySelectedType = this.availableDocumentsList.find(
        document => document.documentType === this.selectedDocumentType,
      );

      return !!docBySelectedType;
    },

    isPending() {
      return this.isAvailableToFinish && !this.isAllDocRequiredTypesVerified;
    },

    isReturnAvailable() {
      if (this.currentComponent === 'required-document-types') {
        return false;
      }
      return this.isReturnable;
    },
  },

  methods: {
    onStartUpload() {
      this.$emit('update', {
        isReturnable: false,
      });
    },

    onReturn() {
      if (!this.isReturnable) return;

      this.handleBack();
    },

    onCancelSelectionRequired() {
      this.$emit('cancel');
    },

    handleFinishSelectionRequired() {
      switch (true) {
        case this.currentComponent !== 'upload-status' && this.isPending:
          this.currentComponent = 'upload-status';
          return;

        case this.currentComponent === 'upload-status' &&
          !this.isAvailableToFinish:
          this.currentComponent = 'required-document-types';
          return;

        default:
          this.$emit('finish');
      }
    },

    async onNext(payload) {
      this.$emit('update', payload);
      this.$emit('update', {
        isReturnable: true,
      });

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

        case this.currentComponent === 'selected-document-by-type':
          this.currentComponent = 'upload';
          break;

        case this.currentComponent === 'upload':
          this.currentComponent = 'required-document-types';
          break;

        case this.currentComponent === 'upload-status':
          this.handleFinishSelectionRequired();
          break;

        default:
          throw new Error(
            'Wrong next case with document required types upload',
          );
      }
    },

    handleBack() {
      switch (true) {
        case this.currentComponent === 'selected-document-by-type':
          this.currentComponent = 'required-document-types';
          break;

        case this.currentComponent === 'upload' &&
          !this.isDocumentsByTypeExists:
          this.currentComponent = 'required-document-types';
          break;

        case this.currentComponent === 'upload' && this.isDocumentsByTypeExists:
          this.currentComponent = 'selected-document-by-type';
          break;

        default:
          break;
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
