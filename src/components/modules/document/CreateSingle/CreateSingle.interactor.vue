<template>
  <document-create
    :types="types"
    :is-extra-loading.sync="isExtraLoading"
    :document-type.sync="documentType"
    @create="onCreate"
    @cancel="onCancel"
    @close="handleClose"
  />
</template>

<script>
import DocumentCreate from '../DocumentCreate';
import CreateSingleController from './CreateSingleController';
import { DOC_TYPES } from '@/constants';

export default {
  name: 'CreateSingleInteractor',

  createSingleController: CreateSingleController(),

  data() {
    return {
      types: [
        DOC_TYPES.PASSPORT,
        DOC_TYPES.DRIVER_LICENSE,
        DOC_TYPES.ID_CARD,
        DOC_TYPES.PROOF_OF_ADDRESS,
      ],
      isExtraLoading: false,
      documentType: this.$options.createSingleController.defaultDocumentType,
    };
  },

  methods: {
    onCancel() {
      if (this.$options.createSingleController.defaultDocumentType) {
        this.handleClose();
      }
    },

    onCreate(documentId) {
      this.$options.createSingleController.finishCreate(documentId);
    },

    handleClose() {
      this.$options.createSingleController.cancelCreate();
    },
  },

  components: {
    DocumentCreate,
  },
};
</script>
