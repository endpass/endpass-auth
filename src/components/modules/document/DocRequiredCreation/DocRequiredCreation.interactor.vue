<template>
  <doc-required-creation
    :doc-type-to-status="docTypeToStatus"
    :is-statuses-appropriated="isStatusesAppropriated"
    :is-statuses-verified="isStatusesVerified"
    :doc-required-types-list="docRequiredTypesList"
    :is-available-to-apply="isAvailableToApply"
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

    docTypeToStatus: {
      type: Object,
      required: true,
    },

    isAvailableToApply: {
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

    isStatusesAppropriated: {
      type: Boolean,
      required: true,
    },

    isStatusesVerified: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onCancel() {
      this.gateway.cancelCreate();
    },

    onCreate() {
      this.gateway.finishCreate();
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
