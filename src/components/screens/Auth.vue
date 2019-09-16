<template>
  <screen @close="handleAuthCancel">
    <v-modal-card
      :loading="!isInited"
      :is-closable="isDialog"
      @close="handleAuthCancel"
    >
      <composite-auth-form
        v-if="activeForm === FORMS.AUTH"
        :closable="isDialog"
        @authorize="handleAuthorize"
      />
      <create-wallet-form v-else-if="activeForm === FORMS.CREATE_WALLET" />
    </v-modal-card>
  </screen>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import CreateWalletForm from '@/components/forms/CreateWallet';

const FORMS = {
  AUTH: 'AUTH',
  CREATE_WALLET: 'CREATE_WALLET',
};

export default {
  name: 'Auth',

  data: () => ({
    isCheckingAccount: false,
    FORMS,
    activeForm: FORMS.AUTH,
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
      showCreateAccount: state => state.core.showCreateAccount,
    }),

    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions([
      'confirmAuth',
      'cancelAuth',
      'dialogClose',
      'checkAccountExists',
      'waitAccountCreate',
      'logout',
    ]),

    async handleAuthCancel() {
      if (this.activeForm === FORMS.CREATE_WALLET) {
        await this.logout();
      }

      this.cancelAuth();
      this.dialogClose();
    },

    async openCreateAccount() {
      const isExist = await this.checkAccountExists();
      if (!isExist) {
        this.activeForm = FORMS.CREATE_WALLET;
        await this.waitAccountCreate();
      }
    },

    async handleAuthorize({ serverMode } = {}) {
      if (this.showCreateAccount) {
        await this.openCreateAccount();
      }

      this.confirmAuth(serverMode);
    },
  },

  components: {
    Screen,
    VModalCard,
    CompositeAuthForm,
    CreateWalletForm,
  },
};
</script>
