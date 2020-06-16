<template>
  <rate-limit-screen v-if="isRateLimit" />
  <div v-else>
    <portal-target
      name="portal-layout"
      class="layout-portal-target"
      @change="onChange"
    />
    <router-view v-show="!isPortalVisible" />
  </div>
</template>

<script>
import RateLimitScreen from '@/components/screens/RateLimit';
import { coreStore } from '@/store';

export default {
  name: 'LayoutScreen',

  coreStore,

  data: () => ({
    isPortalVisible: false,
  }),

  computed: {
    isRateLimit() {
      return this.$options.coreStore.isRateLimit;
    },
  },

  methods: {
    onChange(isVisible) {
      this.isPortalVisible = isVisible;
    },
  },

  components: {
    RateLimitScreen,
  },
};
</script>
