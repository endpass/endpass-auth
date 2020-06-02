<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isAllRequiredVerified"
    @continue="onContinue"
    @create="onContinue"
  />
</template>

<script>
import VueTimers from 'vue-timers/mixin';
import UploadStatusLayout from '@/components/modules/document/common/UploadStatusLayout';

const TIMEOUT_MS = 30 * 1000;
const EXTRA_TIMEOUT_MS = 2 * 60 * 1000;

export default {
  name: 'UploadStatusInteractor',

  props: {
    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    isAllRequiredVerified: {
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
      this.$emit('continue');
    },

    startTimer() {
      this.isPending = true;

      this.timers.pendingTimer.time = this.pendingTimeout;
      this.$timer.start('pendingTimer');
    },
  },

  async mounted() {
    if (this.isAllRequiredVerified) return;

    if (!this.isAvailableToApply) {
      this.isPending = false;
      return;
    }

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
