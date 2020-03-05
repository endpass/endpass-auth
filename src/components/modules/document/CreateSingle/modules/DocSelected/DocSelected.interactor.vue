<template>
  <doc-selected
    :doc-types-list="docTypesList"
    :selected-document-type="selectedDocumentType"
    @create="onCreate"
    @cancel="onClose"
    @close="onClose"
  />
</template>

<script>
import DocSelected from './DocSelected.container';
import CreateSingleController from './CreateSingleController';

import { channelStore } from '@/store';

export default {
  name: 'DocSelectedInteractor',

  createSingleController: CreateSingleController(),
  channelStore,

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },
  },

  computed: {
    selectedDocumentType() {
      return this.$options.channelStore.payload.defaultDocumentType;
    },
  },

  methods: {
    onCreate({ documentId }) {
      this.$options.createSingleController.finishCreate(documentId);
    },

    onClose() {
      this.$options.createSingleController.cancelCreate();
    },
  },

  components: {
    DocSelected,
  },
};
</script>
