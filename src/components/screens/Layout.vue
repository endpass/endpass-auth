<template>
  <rate-limit-screen v-if="isRateLimit" />
  <router-view v-else />
</template>

<script>
import RateLimitScreen from '@/components/screens/RateLimit';
import { coreStore } from '@/store';

export default {
  name: 'LayoutScreen',
  computed: {
    isRateLimit() {
      return coreStore.isRateLimit;
    },
  },

  components: {
    RateLimitScreen,
  },
};
</script>
