<template>
  <doc-required-creation
    :doc-types-list="$options.documentsRequiredStore.docRequiredTypes"
    :doc-type-to-status="$options.documentsRequiredStore.docTypeToStatus"
    :is-statuses-appropriated="
      $options.documentsRequiredStore.isStatusesAppropriated
    "
    :is-statuses-verified="$options.documentsRequiredStore.isStatusesVerified"
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
