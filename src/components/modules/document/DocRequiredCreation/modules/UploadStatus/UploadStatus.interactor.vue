<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isStatusesVerified"
    @continue="onContinue"
    @create="handleCreate"
  />
</template>

<script>
import VueTimers from 'vue-timers/mixin';
import UploadStatusLayout from '@/components/modules/document/common/UploadStatusLayout';

const TIMEOUT_MS = 30 * 1000;
const EXTRA_TIMEOUT_MS = 2 * 60 * 1000;

export default {
  name: 'UploadStatusInteractor',

  inject: ['gateway'],

  props: {
    isStatusesVerified: {
      type: Boolean,
      required: true,
    },

    isStatusesAppropriated: {
      type: Boolean,
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
  },

  methods: {
    onContinue() {
      if (this.isStatusesAppropriated) {
        this.handleCreate();
        return;
      }

      this.$emit('continue');
    },

    handleCreate() {
      this.$emit('create');
    },

    async updateUploadStatus() {
      this.isPending = true;

      if (!this.isStatusesAppropriated) {
        await this.gateway.loadDocumentsTypesAndStatuses();
        await this.$nextTick();
      }

      if (!this.isStatusesAppropriated) {
        this.isPending = false;
        return;
      }

      this.timers.pendingTimer.time = this.pendingTimeout;
      this.$timer.start('pendingTimer');
    },
  },

  async mounted() {
    if (this.isStatusesVerified) {
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
