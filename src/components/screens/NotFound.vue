<template>
  <v-frame @close="handleClose">
    <p>{{ $t('components.notFound') }}</p>
    <br>
    <small>{{ $t('global.version') }} {{ version }}</small>
  </v-frame>
</template>

<script>
import { mapActions } from 'vuex';
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';

export default {
  name: 'NotFound',
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
