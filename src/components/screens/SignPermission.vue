<template>
  <screen @close="handleCancel">
    <v-modal-card
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
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import SignPassword from '@/components/formsComposite/SignPassword';

import { ORIGIN_HOST } from '@/constants';
import { accountsStore, coreStore } from '@/store';

export default {
  name: 'SignPermission',

  accountsStore,
  coreStore,

  data: () => ({
    error: null,
    isLoading: false,
    ORIGIN_HOST,
  }),

  computed: {
    isInited() {
      return this.$options.coreStore.isInited;
    },
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async handleSignSubmit(password) {
      this.isLoading = true;
      this.error = null;

      try {
        await this.$options.accountsStore.signPermission({
          password,
        });
      } catch (err) {
        this.error = this.$i18n.t('components.signPermission.authFailed');
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      this.$options.accountsStore.cancelSignPermission();
      this.$options.coreStore.dialogClose();
    },
  },

  components: {
    SignPassword,
    Screen,
    VModalCard,
  },
};
</script>
