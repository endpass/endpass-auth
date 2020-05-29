<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isVerified"
    @continue="onContinue"
    @create="onContinue"
  />
</template>

<script>
import VueTimers from 'vue-timers/mixin';
import UploadStatusLayout from '@/components/modules/document/common/UploadStatusLayout';
import { DOC_STATUSES } from '@/constants';

const TIMEOUT_MS = 30 * 1000;
const EXTRA_TIMEOUT_MS = 2 * 60 * 1000;

export default {
  name: 'UploadStatusInteractor',

  inject: ['gateway'],

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
      required: true,
    },

    clientId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isPending: true,
  }),

  computed: {
    pendingTimeout() {
      if (ENV.VUE_APP_EXTRA_TIMEOUT_FOR_CLIENT_IDS.includes(this.clientId)) {
        return EXTRA_TIMEOUT_MS;
      }

      return TIMEOUT_MS;
    },

    selectedDocumentStatus() {
      const selectedDocument = this.selectedDocumentsByType[
        this.selectedDocumentType
      ];
      if (!selectedDocument) return null;

      return selectedDocument.status;
    },

    isVerified() {
      const { selectedDocumentStatus } = this;
      return selectedDocumentStatus === DOC_STATUSES.VERIFIED;
    },

    isPendingReview() {
      const { selectedDocumentStatus } = this;
      return selectedDocumentStatus === DOC_STATUSES.PENDING_REVIEW;
    },
  },

  methods: {
    onContinue() {
      this.$emit('continue');
    },

    startTimer() {
      this.isPending = true;

      this.timers.pendingTimer.time = this.pendingTimeout;
      this.$timer.start('pendingTimer');
    },
  },

  async mounted() {
    if (this.isVerified) return;

    this.startTimer();
  },

  mixins: [VueTimers],

  timers: {
    pendingTimer: {
      repeat: false,
      autostart: false,
      time: 1000,
      callback() {
        this.isPending = false;
      },
    },
  },

  components: {
    UploadStatusLayout,
  },
};
</script>
