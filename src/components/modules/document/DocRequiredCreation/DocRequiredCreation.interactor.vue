<template>
  <doc-required-creation
    :doc-types-list="$options.documentsRequiredStore.docRequiredTypes"
    :doc-type-to-status="$options.documentsRequiredStore.docTypeToStatus"
    :is-has-bad-status="$options.documentsRequiredStore.isHasBadStatus"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocRequiredCreation from './DocRequiredCreation.state';
import createDocumentRequiredController from './DocumentRequiredController';

import { documentsRequiredStore } from '@/store';

export default {
  name: 'DocRequiredCreationInteractor',

  documentsRequiredStore,

  docRequiredController: createDocumentRequiredController(),

  methods: {
    onCancel() {
      this.$options.docRequiredController.cancelCreate();
    },

    onCreate() {
      this.$options.docRequiredController.finishCreate();
    },
  },

  components: {
    DocRequiredCreation,
  },
};
</script>
