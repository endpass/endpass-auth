<template>
  <v-frame>
    <v-error
      :hint="errorHint"
      :description="errorDescription"
    />
  </v-frame>
</template>

<script>
/* eslint-disable camelcase */

import { mapActions } from 'vuex';
import VFrame from '@/components/common/VFrame';
import VError from '@/components/common/VError';

export default {
  name: 'Error',

  data() {
    return {
      errorHint: '',
      errorDescription: '',
    };
  },

  methods: {
    ...mapActions(['dialogClose']),

    handleClose() {
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
    VError,
  },
};
</script>
