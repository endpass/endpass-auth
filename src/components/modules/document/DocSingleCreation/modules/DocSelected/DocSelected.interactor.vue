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
import createDocSingleController from '../controllers/DocumentSingleController';

import { channelStore } from '@/store';

export default {
  name: 'DocSelectedInteractor',

  docSingleController: createDocSingleController(),
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
      this.$options.docSingleController.finishCreate({ documentId });
    },

    onCancel() {
      this.$options.docSingleController.cancelCreate();
    },
  },

  components: {
    DocSelected,
  },
};
</script>
