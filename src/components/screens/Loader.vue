<template>
  <v-frame :is-loading="true">
    <p>{{ $t('global.version') }} {{ version }}</p>
  </v-frame>
</template>

<script>
import { mapActions } from 'vuex';
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';

export default {
  name: 'Loader',

  computed: {
    version() {
      return pkg.version;
    },
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
