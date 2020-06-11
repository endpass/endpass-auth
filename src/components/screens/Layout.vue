<template>
  <rate-limit-screen v-if="isRateLimit" />
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import RateLimitScreen from '@/components/screens/RateLimit';
import { coreStore } from '@/store';

export default {
  name: 'LayoutScreen',
  coreStore,
  computed: {
    isRateLimit() {
      return this.$options.coreStore.isRateLimit;
    },
  },

  components: {
    RateLimitScreen,
  },
};
</script>
