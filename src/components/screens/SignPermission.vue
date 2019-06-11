<template>
  <screen @close="handleCancel">
    <v-frame
      :loading="false"
      :closable="isDialog"
      @close="handleCancel"
    >
      <sign-password
        :with-logout-btn="true"
        :requester-url="ORIGIN_HOST"
        :is-loading="isLoading"
        :error="error"
        @submit="handleSignSubmit"
        @cancel="handleCancel"
      />
    </v-frame>
  </screen>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import SignPassword from '@/components/forms/SignPassword';

import { ORIGIN_HOST } from '@/constants';

export default {
  name: 'SignPermission',

  data: () => ({
    error: null,
    isLoading: false,
    ORIGIN_HOST,
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
    }),
    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions(['signPermission', 'cancelSignPermission', 'dialogClose']),

    async handleSignSubmit(password) {
      this.isLoading = true;
      try {
        await this.signPermission({
          password,
        });

        this.error = null;
      } catch (err) {
        this.error = 'No permission';
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      this.cancelSignPermission();
      this.dialogClose();
    },
  },

  components: {
    SignPassword,
    Screen,
    VFrame,
  },
};
</script>
