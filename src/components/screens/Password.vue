<template>
  <screen @close="handleCancel">
    <v-modal-card
      :loading="false"
      :is-closable="isDialog"
      @close="handleCancel"
    >
      <sign-password
        :requester-url="ORIGIN_HOST"
        :is-loading="isLoading"
        :error="error"
        @submit="handlePasswordSubmit"
        @cancel="handleCancel"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapGetters, mapState } from 'vuex';
import Screen from '@/components/common/Screen';
import VModalCard from '@endpass/ui/kit/VModalCard';
import SignPassword from '@/components/forms/SignPassword';

import { ORIGIN_HOST } from '@/constants';

export default {
  name: 'Password',

  data: () => ({
    error: null,
    isLoading: false,
    ORIGIN_HOST,
  }),

  computed: {
    ...mapState({
      settings: state => state.accounts.settings,
      isInited: state => state.core.isInited,
    }),
    ...mapGetters(['isDialog']),

    currentAddress() {
      return get(this.settings, 'lastActiveAccount');
    },
  },

  methods: {
    ...mapActions([
      'signPassword',
      'cancelSignPassword',
      'defineSettings',
      'dialogClose',
    ]),

    async handlePasswordSubmit(password) {
      this.isLoading = true;
      this.error = null;

      try {
        await this.signPassword({
          address: this.currentAddress,
          password,
        });
      } catch (err) {
        this.error = this.$i18n.t('components.password.incorrectPassword');
      } finally {
        this.isLoading = false;
      }
    },

    handleCancel() {
      this.cancelSignPassword();
      this.dialogClose();
    },
  },

  async created() {
    await this.defineSettings();
  },

  components: {
    SignPassword,
    Screen,
    VModalCard,
  },
};
</script>
