<template>
  <doc-specified
    :doc-types-list="docTypesList"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocSpecified from './DocSpecified.state';
import createDocSingleController from '../controllers/DocumentSingleController';

export default {
  name: 'DocSpecifiedInteractor',

  docSingleController: createDocSingleController(),

  props: {
    docTypesList: {
      type: Array,
      required: true,
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
    DocSpecified,
  },
};
</script>
