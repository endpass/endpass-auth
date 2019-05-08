<template>
  <screen @close="handleAuthCancel">
    <v-frame
      :loading="!inited"
      :closable="isDialog"
      @close="handleAuthCancel"
    >
      <composite-auth-form
        v-if="activeForm === FORMS.AUTH"
        :closable="isDialog"
        @authorize="handleAuthorize"
      />
      <create-account-form
        v-else-if="activeForm === FORMS.CREATE_ACCOUNT"
        @request="handleAccountRequest"
      />
    </v-frame>
  </screen>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import CreateAccountForm from '@/components/forms/CreateAccount';

const FORMS = {
  AUTH: 'AUTH',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
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
      inited: state => state.core.inited,
      showCreateAccount: state => state.core.showCreateAccount,
    }),

    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions([
      'confirmAuth',
      'cancelAuth',
      'dialogClose',
      'openCreateAccountPage',
      'checkAccountExists',
      'waitAccountCreate',
    ]),

    handleAuthCancel() {
      this.cancelAuth();
      this.dialogClose();
    },

    async handleAccountRequest() {
      this.openCreateAccountPage();
    },

    async openCreateAccount() {
      const isExist = await this.checkAccountExists();
      if (!isExist) {
        this.activeForm = FORMS.CREATE_ACCOUNT;
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
    VFrame,
    CompositeAuthForm,
    CreateAccountForm,
  },
};
</script>
