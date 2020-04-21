<template>
  <doc-required-creation
    :doc-types-list="$options.documentsRequiredStore.docRequiredTypes"
    :doc-type-to-status="$options.documentsRequiredStore.docTypeToStatus"
    :is-all-has-appropriate-status="
      $options.documentsRequiredStore.isAllHasAppropriateStatus
    "
    :is-required-docs-verified-status="
      $options.documentsRequiredStore.isRequiredDocsVerifiedStatus
    "
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
    const { docRequiredController } = this.$options;
    return {
      gateway: {
        cancelCreate() {
          docRequiredController.cancelCreate();
        },

        finishCreate() {
          docRequiredController.finishCreate();
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

  components: {
    DocRequiredCreation,
  },
};
</script>
