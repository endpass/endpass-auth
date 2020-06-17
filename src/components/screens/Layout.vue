<template>
  <rate-limit-screen v-if="isRateLimit" />
  <div v-else>
    <portal-target
      :name="$options.PORTAL_NAME"
      class="layout-portal-target"
      @change="onChange"
    />
    <router-view v-show="!isPortalVisible" />
  </div>
</template>

<script>
import RateLimitScreen from '@/components/screens/RateLimit';
import { coreStore } from '@/store';
import { PORTAL_NAME } from '@/constants';

export default {
  name: 'LayoutScreen',

  PORTAL_NAME,

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
