<template>
  <doc-required-creation
    :doc-types-list="$options.documentsRequiredStore.docRequiredTypes"
    :doc-type-to-status="$options.documentsRequiredStore.docTypeToStatus"
    :is-all-has-appropriate-status="
      $options.documentsRequiredStore.isAllHasAppropriateStatus
    "
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

  beforeMount() {
    this.$options.documentsRequiredStore.initEvents();
  },

  beforeDestroy() {
    this.$options.documentsRequiredStore.stopEvents();
  },

  components: {
    DocRequiredCreation,
  },
};
</script>
