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
import { accountsStore, coreStore } from '@/store';

export default {
  name: 'NotFound',
  coreStore,
  accountsStore,
  data() {
    return {
      version: pkg.version,
    };
  },

  methods: {
    handleClose() {
      this.$options.coreStore.dialogClose();
      this.$options.accountsStore.cancelAllChannels();
    },
  },

  mounted() {
    this.$options.coreStore.dialogSendOpen();
  },

  components: {
    VFrame,
  },
};
</script>
