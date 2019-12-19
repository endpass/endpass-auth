<template>
  <v-frame :is-loading="true">
    <v-description>{{ $t('global.version') }} {{ version }}</v-description>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'Loader',

  computed: {
    version() {
      return pkg.version;
    },
  },

  components: {
    VFrame,
    VDescription,
  },
};
</script>
