<template>
  <doc-required-creation
    :doc-types-list="docTypesList"
    :doc-type-to-status="docTypeToStatus"
    :is-statuses-appropriated="isStatusesAppropriated"
    :is-statuses-verified="isStatusesVerified"
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
