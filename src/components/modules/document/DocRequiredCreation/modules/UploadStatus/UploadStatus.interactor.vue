<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isAllDocRequiredTypesVerified"
    @continue="onFinish"
    @create="onFinish"
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
    isAvailableToFinish: {
      type: Boolean,
      required: true,
    },

    isAllDocRequiredTypesVerified: {
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
    onFinish() {
      this.$emit('finish');
    },

    startTimer() {
      this.isPending = true;

      this.timers.pendingTimer.time = this.pendingTimeout;
      this.$timer.start('pendingTimer');
    },
  },

  async mounted() {
    if (this.isAllDocRequiredTypesVerified) return;

    if (!this.isAvailableToFinish) {
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
