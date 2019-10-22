<template>
  <v-frame
    :is-closable="isDialog"
    @close="onClose"
  >
    <div class="public-error v-lh-1-5">
      <h1>
        {{ errorHint }}
      </h1>
      <p>
        {{ errorDescription }}
      </p>
    </div>
  </v-frame>
</template>

<script>
/* eslint-disable camelcase */

import VFrame from '@/components/common/VFrame';
import { accountsStore, coreStore } from '@/store';

export default {
  name: 'Error',

  accountsStore,
  coreStore,

  data() {
    return {
      errorHint: '',
      errorDescription: '',
    };
  },

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    onClose() {
      this.$options.accountsStore.cancelAllChannels();
      this.$options.coreStore.dialogClose();
    },
  },

  mounted() {
    const { error = '', error_description = '' } = this.$route.query;
    this.errorHint = error;
    this.errorDescription = error_description;
  },

  components: {
    VFrame,
  },
};
</script>

<style lang="postcss">
.public-error h1 {
  font-size: 26px;
  font-weight: bold;
}
</style>
