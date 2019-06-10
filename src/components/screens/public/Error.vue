<template>
  <v-frame
    :closable="isDialog"
    @close="handleClose"
  >
    <div class="public-error">
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

import { mapActions, mapGetters } from 'vuex';
import VFrame from '@/components/common/VFrame';

export default {
  name: 'Error',

  data() {
    return {
      errorHint: '',
      errorDescription: '',
    };
  },

  computed: {
    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions(['cancelAllChannels', 'dialogClose']),

    handleClose() {
      this.cancelAllChannels();
      this.dialogClose();
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
.public-error {
  line-height: 1.5;
}

.public-error h1 {
  font-size: 26px;
  font-weight: bold;
}
</style>
