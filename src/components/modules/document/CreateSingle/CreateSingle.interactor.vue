<template>
  <document-create
    :types="types"
    :is-extra-loading.sync="isExtraLoading"
    :document-type.sync="documentType"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocumentCreate from '../DocumentCreate';
import CreateSingleController from './CreateSingleController';
import { DOC_TYPES } from '@/constants';

export default {
  name: 'DocumentCreate',

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
      documentType: '',
    };
  },

  methods: {
    onCancel() {
      this.$options.createSingleController.cancelCreate();
    },

    onCreate(documentId) {
      this.$options.createSingleController.finishCreate(documentId);
    },
  },

  components: {
    DocumentCreate,
  },
};
</script>
