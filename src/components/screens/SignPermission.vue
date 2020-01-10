<template>
  <screen @close="handleCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="handleCancel"
    >
      <loading-screen :is-loading="isChecking">
        <sign-password
          v-if="isPasswordExist"
          :with-logout-btn="true"
          :requester-url="Host.origin"
          :is-loading="isLoading"
          :error="error"
          @submit="onSignPassword"
          @cancel="handleCancel"
          @logout="onLogout"
        />
        <create-regular-password
          v-else
          @submit="onSignPassword"
        />
      </loading-screen>
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import SignPassword from '@/components/forms/SignPassword';
import LoadingScreen from '@/components/common/LoadingScreen';
import CreateRegularPassword from '@/components/forms/CreateRegularPassword';

import Host from '@/class/singleton/Host';
import { authStore, accountsStore, coreStore } from '@/store';

export default {
  name: 'SignPermission',

  accountsStore,
  coreStore,
  authStore,

  data: () => ({
    error: null,
    isLoading: false,
    isChecking: true,
    isPasswordExist: true,
    Host,
  }),

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async onSignPassword(password) {
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

    onLogout() {
      this.$options.coreStore.logout();
      this.handleCancel();
    },
  },

  async mounted() {
    this.isChecking = true;
    try {
      this.isPasswordExist = await this.$options.authStore.checkRegularPassword();
    } catch (e) {
      this.error = this.$i18n.t('components.signPermission.authFailed');
    } finally {
      this.isChecking = false;
    }
  },

  components: {
    CreateRegularPassword,
    LoadingScreen,
    SignPassword,
    Screen,
    VModalCard,
  },
};
</script>
