<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { coreStore } from '@/store';

export default {
  name: 'Screen',

  methods: {
    handleWindowClose() {
      this.$emit('close');
    },
  },

  created() {
    if (coreStore.isDialog) {
      window.addEventListener('beforeunload', this.handleWindowClose);
    }
  },
};
</script>
