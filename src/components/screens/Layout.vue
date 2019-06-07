<template>
  <rate-limit-screen v-if="isRateLimit" />
  <router-view v-else />
</template>

<script>
import { mapGetters } from 'vuex';
import RateLimitScreen from '@/components/screens/RateLimit';

export default {
  name: 'LayoutScreen',

  computed: {
    ...mapGetters(['isRateLimit']),
  },

  components: {
    RateLimitScreen,
  },
};
</script>
