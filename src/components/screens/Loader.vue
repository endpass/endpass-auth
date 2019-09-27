<template>
  <v-frame :is-loading="true">
    <p>{{ $t('global.version') }} {{ version }}</p>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';
import { coreStore } from '@/store';

export default {
  name: 'Loader',

  coreStore,

  computed: {
    version() {
      return pkg.version;
    },
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
