<template>
  <doc-specified
    :doc-types-list="docTypesList"
    @create="onCreate"
    @cancel="onClose"
    @close="onClose"
  />
</template>

<script>
import DocSpecified from './DocSpecified.container';
import CreateSingleController from './CreateSingleController';

import { channelStore } from '@/store';

export default {
  name: 'DocSpecifiedInteractor',

  createSingleController: CreateSingleController(),
  // TODO: maybe move to gateway and use controller from top level?

  channelStore,

  props: {
    docTypesList: {
      type: Array,
      required: true,
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
    DocSpecified,
  },
};
</script>
