<template>
  <doc-layout
    :is-closable="isClosable"
    :is-returnable="isReturnable"
    @return="onReturn"
    @close="onCancel"
  >
    <component
      :is="currentComponent"
      :selected-document-type="selectedDocumentType"
      :doc-required-types-list="docRequiredTypesList"
      :is-available-to-apply="isAvailableToApply"
      :is-all-required-verified="isAllRequiredVerified"
      :selected-documents-by-type="selectedDocumentsByType"
      :available-documents-list="availableDocumentsList"
      @next="onNext"
      @create="onCreate"
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
    docRequiredTypesList: {
      type: Array,
      required: true,
    },

    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    isAllRequiredVerified: {
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
      return this.isAvailableToApply && !this.isAllRequiredVerified;
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

  methods: {
    onReturn() {
      if (!this.isReturnable) return;

      this.handleBack();
    },

    onCancel() {
      this.$emit('cancel');
    },

    onCreate() {
      this.handleCreate();
    },

    handleCreate() {
      // TODO: change from create to confirm
      if (this.isPending) {
        this.currentComponent = 'upload-status';
        return;
      }

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

        case this.currentComponent === 'selected-document-by-type':
          this.currentComponent = 'upload';
          break;

        case this.currentComponent === 'upload':
          this.currentComponent = 'required-document-types';
          break;

        case this.currentComponent === 'upload-status':
          this.handleCreate();
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
