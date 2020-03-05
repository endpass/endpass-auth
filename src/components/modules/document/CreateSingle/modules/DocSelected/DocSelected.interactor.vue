<template>
  <doc-selected
    :doc-types-list="docTypesList"
    :selected-document-type="selectedDocumentType"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocSelected from './DocSelected.state';
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
      this.$options.createSingleController.finishCreate({ documentId });
    },

    onCancel() {
      this.$options.createSingleController.cancelCreate();
    },
  },

  components: {
    DocSelected,
  },
};
</script>
