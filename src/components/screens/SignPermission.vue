<template>
  <screen @close="handleCancel">
    <v-modal-card
      :loading="false"
      :is-closable="isDialog"
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
    </v-modal-card>
  </screen>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Screen from '@/components/common/Screen';
import VModalCard from '@endpass/ui/kit/VModalCard';
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
      this.error = null;

      try {
        await this.signPermission({
          password,
        });
      } catch (err) {
        this.error = this.$i18n.t('components.signPermission.authFailed');
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
    VModalCard,
  },
};
</script>
