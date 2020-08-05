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
import { coreStore } from '@/store';

export default {
  name: 'Error',

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
      this.$options.coreStore.cancelAllChannels();
      this.$options.coreStore.dialogClose();
    },
  },

  mounted() {
    const {
      error = '',
      error_description = '',
      description = '',
    } = this.$route.query;
    this.errorHint = error;
    this.errorDescription = error_description || description;
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
