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
import { mapGetters, mapState } from 'vuex';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import SignPassword from '@/components/formsComposite/SignPassword';

import { ORIGIN_HOST } from '@/constants';
import { accountsStore, coreStore } from '@/store';

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
    ...mapGetters('core', ['isDialog']),
  },

  methods: {
    async handleSignSubmit(password) {
      this.isLoading = true;
      this.error = null;

      try {
        await accountsStore.signPermission({
          password,
        });
      } catch (err) {
        this.error = this.$i18n.t('components.signPermission.authFailed');
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      accountsStore.cancelSignPermission();
      coreStore.dialogClose();
    },
  },

  components: {
    SignPassword,
    Screen,
    VModalCard,
  },
};
</script>
