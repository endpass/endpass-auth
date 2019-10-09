<template>
  <screen @close="handleCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="handleCancel"
    >
      <loading-screen v-if="isChecking" />
      <sign-password
        v-else
        :with-logout-btn="true"
        :requester-url="ORIGIN_HOST"
        :is-loading="isLoading"
        :error="error"
        @submit="handleSignSubmit"
        @cancel="handleCancel"
        @logout="handleLogout"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import SignPassword from '@/components/forms/SignPassword';

import { ORIGIN_HOST } from '@/constants';
import { authStore, accountsStore, coreStore } from '@/store';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'SignPermission',

  accountsStore,
  coreStore,
  authStore,

  data: () => ({
    error: null,
    isLoading: false,
    isChecking: true,
    ORIGIN_HOST,
  }),

  computed: {
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

    handleLogout() {
      this.$options.coreStore.logout();
      this.handleCancel();
    },
  },

  async mounted() {
    this.isChecking = true;
    try {
      const isPasswordExist = await this.$options.authStore.checkRegularPassword();

      if (!isPasswordExist) {
        this.handleLogout();
      }
    } finally {
      this.isChecking = false;
    }
  },

  components: {
    LoadingScreen,
    SignPassword,
    Screen,
    VModalCard,
  },
};
</script>
