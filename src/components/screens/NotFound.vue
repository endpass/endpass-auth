<template>
  <v-frame @close="handleClose">
    <p>Sorry, but place is not found</p>
    <br />
    <small>Endpass Auth v{{ version }}</small>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';
import { mapActions } from 'vuex';

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
