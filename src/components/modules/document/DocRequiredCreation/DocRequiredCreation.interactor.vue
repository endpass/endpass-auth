<template>
  <doc-required-creation
    :doc-types-list="docTypesList"
    :doc-type-to-status="docTypeToStatus"
    :is-all-has-appropriate-status="isAllHasAppropriateStatus"
    :is-required-docs-verified-status="isRequiredDocsVerifiedStatus"
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
    docTypesList: {
      type: Array,
      required: true,
    },

    docTypeToStatus: {
      type: Object,
      required: true,
    },

    isAllHasAppropriateStatus: {
      type: Boolean,
      required: true,
    },

    isRequiredDocsVerifiedStatus: {
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
