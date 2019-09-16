<template>
  <v-frame @close="handleClose">
    <p>{{ $t('global.version') }}{{ version }}</p>
  </v-frame>
</template>

<script>
import { mapActions } from 'vuex';
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';

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
    ...mapActions(['dialogClose']),

    handleClose() {
      this.dialogClose();
    },
  },

  components: {
    VFrame,
  },
};
</script>
