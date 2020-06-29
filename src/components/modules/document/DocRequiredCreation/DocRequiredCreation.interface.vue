<template>
  <doc-required-creation-state
    #default="{ selectedDocumentType, isReturnable, updateState }"
  >
    <doc-required-creation-interactor #default="{ onCancel, onFinish }">
      <doc-required-creation-container
        :selected-document-type="selectedDocumentType"
        :is-returnable="isReturnable"
        :is-available-to-finish="isAvailableToFinish"
        :is-all-doc-required-types-verified="isAllDocRequiredTypesVerified"
        :doc-required-types-list="docRequiredTypes"
        :selected-documents-by-type="selectedDocumentsByType"
        :available-documents-list="availableDocumentsList"
        @update="updateState"
        @cancel="onCancel"
        @finish="onFinish"
      />
    </doc-required-creation-interactor>
  </doc-required-creation-state>
</template>
<script>
import DocRequiredCreationInteractor from './DocRequiredCreation.interactor';
import DocRequiredCreationState from './DocRequiredCreation.state';
import DocRequiredCreationContainer from './DocRequiredCreation.container';

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
        async cancelCreate() {
          await documentsRequiredStore.answerCancel();
        },

        async finishCreate() {
          await documentsRequiredStore.answerFinish();
        },

        async clearSelectedDocuments() {
          await documentsRequiredStore.clearSelectedDocuments();
        },

        async subscribeToUpdateStatus() {
          await docRequiredController.subscribeToUpdateStatus();
        },

        async unsubscribeFromUpdateStatus() {
          await docRequiredController.unsubscribeFromUpdateStatus();
        },
      },
    };
  },

  computed: {
    availableDocumentsList() {
      return this.$options.documentsRequiredStore.availableDocumentsList;
    },

    isAvailableToFinish() {
      return this.$options.documentsRequiredStore.isAvailableToFinish;
    },

    isAllDocRequiredTypesVerified() {
      return this.$options.documentsRequiredStore.isAllDocRequiredTypesVerified;
    },

    docRequiredTypes() {
      return this.$options.documentsRequiredStore.docRequiredTypes;
    },

    selectedDocumentsByType() {
      return this.$options.documentsRequiredStore.selectedDocumentsByType;
    },
  },

  components: {
    DocRequiredCreationInteractor,
    DocRequiredCreationState,
    DocRequiredCreationContainer,
  },
};
</script>
