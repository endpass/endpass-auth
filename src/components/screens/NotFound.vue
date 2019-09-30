<template>
  <v-frame @close="handleClose">
    <p>{{ $t('components.notFound') }}</p>
    <br>
    <small>{{ $t('global.version') }} {{ version }}</small>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';
import { coreStore } from '@/store';

export default {
  name: 'NotFound',
  coreStore,
  data() {
    return {
      version: pkg.version,
    };
  },

  methods: {
    handleClose() {
      this.$options.coreStore.dialogClose();
    },
  },

  components: {
    VFrame,
  },
};
</script>
