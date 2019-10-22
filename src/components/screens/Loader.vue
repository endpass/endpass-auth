<template>
  <v-frame :is-loading="true">
    <p>{{ $t('global.version') }} {{ version }}</p>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';

export default {
  name: 'Loader',

  computed: {
    version() {
      return pkg.version;
    },
  },

  components: {
    VFrame,
  },
};
</script>
