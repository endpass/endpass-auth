<template>
  <v-frame @close="onClose">
    <message>{{ $t('components.notFound') }}</message>
    <br>
    <v-description>{{ $t('global.version') }} {{ version }}</v-description>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from '@/components/common/VFrame';
import { coreStore, accountsStore } from '@/store';
import VDescription from '@/components/common/VDescription';
import Message from '@/components/common/Message';

export default {
  name: 'NotFound',

  accountsStore,
  coreStore,

  data() {
    return {
      version: pkg.version,
    };
  },

  methods: {
    onClose() {
      this.$options.coreStore.cancelAllChannels();
      this.$options.coreStore.dialogClose();
    },
  },

  mounted() {
    this.$options.coreStore.dialogSendOpen();
  },

  components: {
    Message,
    VFrame,
    VDescription,
  },
};
</script>
