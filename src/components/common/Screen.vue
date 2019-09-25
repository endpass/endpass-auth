<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Screen',

  methods: {
    ...mapGetters('core', ['isDialog']),

    handleWindowClose() {
      this.$emit('close');
    },
  },

  created() {
    if (this.isDialog) {
      window.addEventListener('beforeunload', this.handleWindowClose);
    }
  },
};
</script>
