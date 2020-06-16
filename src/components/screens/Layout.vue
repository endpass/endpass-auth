<template>
  <rate-limit-screen v-if="isRateLimit" />
  <div v-else>
    <portal-target
      name="portal-layout"
      class="layout-portal-target"
    />
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

<style lang="postcss">
.layout-portal-target:not(:empty) + * {
  display: none;
  visibility: hidden;
}
</style>
