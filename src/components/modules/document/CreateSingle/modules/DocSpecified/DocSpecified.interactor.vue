<template>
  <doc-specified
    :doc-types-list="docTypesList"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocSpecified from './DocSpecified.state';
import CreateSingleController from './CreateSingleController';

export default {
  name: 'DocSpecifiedInteractor',

  createSingleController: CreateSingleController(),
  // TODO: maybe move to gateway and use controller from top level?

  props: {
    docTypesList: {
      type: Array,
      required: true,
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
    DocSpecified,
  },
};
</script>
