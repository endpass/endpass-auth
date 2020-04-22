<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isRequiredDocsVerifiedStatus"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import VueTimers from 'vue-timers/mixin';
import UploadStatusLayout from '@/components/modules/document/common/UploadStatusLayout';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';

const TIMEOUT_MS = 30 * 1000;
const EXTRA_TIMEOUT_MS = 2 * 60 * 1000;

export default {
  name: 'UploadStatusInteractor',

  documentsRequiredStore: documentsRequiredStoreModule,

  data: () => ({
    isPending: true,
  }),

  computed: {
    isRequiredDocsVerifiedStatus() {
      return this.$options.documentsRequiredStore.isRequiredDocsVerifiedStatus;
    },

    pendingTimeout() {
      const extraClientIds = ENV.VUE_APP_EXTRA_TIMEOUT_FOR_CLIENT_IDS;
      const { clientId } = this.$options.documentsRequiredStore;
      if (extraClientIds.includes(clientId)) {
        return EXTRA_TIMEOUT_MS;
      }

      return TIMEOUT_MS;
    },
  },

  methods: {
    onContinue() {
      if (this.isRequiredDocsVerifiedStatus) {
        this.$emit('create');
        return;
      }

      this.$emit('continue');
    },

    onCreate() {
      this.$emit('create');
    },

    async updateUploadStatus() {
      const { documentsRequiredStore } = this.$options;
      this.isPending = true;

      if (!documentsRequiredStore.isAllHasAppropriateStatus) {
        await documentsRequiredStore.reloadDocumentsStatuses();
      }

      if (!documentsRequiredStore.isAllHasAppropriateStatus) {
        this.isPending = false;
        return;
      }

      this.timers.pendingTimer.time = this.pendingTimeout;
      this.$timer.start('pendingTimer');
    },
  },

  async mounted() {
    if (this.isRequiredDocsVerifiedStatus) {
      this.isPending = false;
      return;
    }

    await this.updateUploadStatus();
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
