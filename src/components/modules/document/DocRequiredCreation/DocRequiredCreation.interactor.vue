<template>
  <doc-required-creation
    :doc-required-types-list="docRequiredTypesList"
    :is-available-to-apply="isAvailableToApply"
    :is-all-required-verified="isAllRequiredVerified"
    :selected-documents-by-type="selectedDocumentsByType"
    :available-documents-list="availableDocumentsList"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocRequiredCreation from './DocRequiredCreation.state';

export default {
  name: 'DocRequiredCreationInteractor',

  inject: ['gateway'],

  props: {
    docRequiredTypesList: {
      type: Array,
      required: true,
    },

    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    isAllRequiredVerified: {
      type: Boolean,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
      required: true,
    },

    availableDocumentsList: {
      type: Array,
      required: true,
    },
  },

  methods: {
    async onCancel() {
      await this.gateway.cancelCreate();
    },

    async onCreate() {
      await this.gateway.finishCreate();
    },
  },

  beforeMount() {
    this.gateway.subscribeToUpdateStatus();
  },

  beforeDestroy() {
    this.gateway.unsubscribeFromUpdateStatus();
  },

  components: {
    DocRequiredCreation,
  },
};
</script>
