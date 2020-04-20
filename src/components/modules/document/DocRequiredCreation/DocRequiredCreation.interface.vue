<template>
  <doc-required-creation
    :doc-types-list="$options.documentsRequiredStore.docRequiredTypes"
    :doc-type-to-status="$options.documentsRequiredStore.docTypeToStatus"
    :is-all-has-appropriate-status="
      $options.documentsRequiredStore.isAllHasAppropriateStatus
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
    const { docRequiredController, documentsRequiredStore } = this.$options;
    return {
      gateway: {
        cancelCreate() {
          docRequiredController.cancelCreate();
        },

        onCreate() {
          docRequiredController.finishCreate();
        },

        initEvents() {
          documentsRequiredStore.initEvents();
        },

        stopEvents() {
          documentsRequiredStore.stopEvents();
        },
      },
    };
  },

  components: {
    DocRequiredCreation,
  },
};
</script>
