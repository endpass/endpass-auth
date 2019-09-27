<template>
  <v-frame @close="handleClose">
    <p>{{ $t('global.version') }}{{ version }}</p>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';
import { coreStore } from '@/store';

if (ENV.VUE_APP_SHOW_VERSION_INFO) {
  // eslint-disable-next-line no-console
  console.info(
    `%cEndpass Auth Bridge (${pkg.version}) loaded 🔌`,
    'font-size: 14px; font-weight: bold',
  );
}

export default {
  name: 'Bridge',
  data() {
    return {
      version: pkg.version,
    };
  },

  methods: {
    handleClose() {
      coreStore.dialogClose();
    },
  },

  components: {
    VFrame,
  },
};
</script>
