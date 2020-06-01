<template>
  <component
    :is="currentComponent"
    :status="status"
    :date-of-expiry="dateOfExpiry"
  />
</template>

<script>
import { DOC_STATUSES } from '@/constants';
import Status from './modules/Status';
import StatusVerified from './modules/StatusVerified';
import StatusNotReadable from './modules/StatusNotReadable';

export default {
  name: 'DocumentStatusView',

  props: {
    status: {
      type: String,
      required: true,
    },

    dateOfExpiry: {
      type: Number,
      default: null,
    },
  },

  computed: {
    currentComponent() {
      switch (this.status) {
        case DOC_STATUSES.VERIFIED:
          return StatusVerified;

        case DOC_STATUSES.NOT_READABLE:
        case DOC_STATUSES.NOT_VERIFIED:
          return StatusNotReadable;

        case DOC_STATUSES.PENDING_REVIEW:
        case DOC_STATUSES.RECOGNITION:
        default:
          return Status;
      }
    },
  },
};
</script>
