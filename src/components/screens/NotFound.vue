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
import { accountsStore, coreStore } from '@/store';
import VDescription from '@/components/common/VDescription';
import Message from '@/components/common/Message';

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
    onClose() {
      this.$options.coreStore.dialogClose();
      this.$options.accountsStore.cancelAllChannels();
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
