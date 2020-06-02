<template>
  <doc-required-creation
    :is-available-to-apply="isAvailableToApply"
    :is-all-required-verified="isAllRequiredVerified"
    :doc-required-types-list="docRequiredTypes"
    :selected-documents-by-type="selectedDocumentsByType"
    :available-documents-list="availableDocumentsList"
  />
</template>

<script>
import DocRequiredCreation from './DocRequiredCreation.interactor';
import createDocumentRequiredController from './DocRequiredCreation.controller';

import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';

export default {
  name: 'CreateRequiredInterface',

  docRequiredController: createDocumentRequiredController(),

  documentsRequiredStore: documentsRequiredStoreModule,

  provide() {
    const { docRequiredController, documentsRequiredStore } = this.$options;
    return {
      gateway: {
        cancelCreate() {
          documentsRequiredStore.answerCancel();
        },

        finishCreate() {
          documentsRequiredStore.answerFinish();
        },

        subscribeToUpdateStatus() {
          docRequiredController.subscribeToUpdateStatus();
        },

        unsubscribeFromUpdateStatus() {
          docRequiredController.unsubscribeFromUpdateStatus();
        },
      },
    };
  },

  computed: {
    availableDocumentsList() {
      return this.$options.documentsRequiredStore.availableDocumentsList;
    },

    isAvailableToApply() {
      return this.$options.documentsRequiredStore.isAvailableToApply;
    },

    isAllRequiredVerified() {
      return this.$options.documentsRequiredStore.isAllRequiredVerified;
    },

    docRequiredTypes() {
      return this.$options.documentsRequiredStore.docRequiredTypes;
    },

    selectedDocumentsByType() {
      return this.$options.documentsRequiredStore.selectedDocumentsByType;
    },
  },

  components: {
    DocRequiredCreation,
  },
};
</script>
