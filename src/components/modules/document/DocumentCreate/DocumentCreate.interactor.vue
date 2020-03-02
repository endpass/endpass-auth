<template>
  <document-create
    :is-returnable="isReturnable"
    :is-closable="isClosable"
    @cancel="onCancel"
    @return="onReturn"
  />
</template>

<script>
import DocumentCreate from './DocumentCreate.view';
import { coreStore, documentStore } from '@/store';

export default {
  name: 'DocumentCreate',

  coreStore,
  documentStore,

  props: {
    isReturnable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isClosable() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    onReturn() {
      this.$emit('return');
    },

    onCreate(documentId) {
      this.$emit('create', documentId);
    },

    onRequired() {
      this.$emit('required');
    },
  },

  mounted() {
    // const { clientId } = this.$options.documentStore.uploadOptions;
    // if (!clientId) {
    //   return;
    // }
    //
    // const docTypes = this.$options.documentStore.getRequiredDocumentsTypes(clientId);
  },

  components: {
    DocumentCreate,
  },
};
</script>
