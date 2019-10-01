<template>
  <screen class="auth-screen-centered">
    <v-modal-card
      :is-closable="false"
      @close="handleAuthCancel"
    >
      <composite-auth-form
        v-if="activeForm === FORMS.AUTH"
        :is-closable="false"
        :is-public="true"
        @authorize="handleAuthorize"
      />
      <create-wallet-form v-else-if="activeForm === FORMS.CREATE_WALLET" />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import CreateWalletForm from '@/components/forms/CreateWallet';
import { parseUrl } from '@/util/dom';
import { authStore, accountsStore, coreStore } from '@/store';

const FORMS = {
  AUTH: 'AUTH',
  CREATE_WALLET: 'CREATE_WALLET',
};

export default {
  name: 'PublicAuth',

  accountsStore,
  authStore,
  coreStore,

  data: () => ({
    queryParamsMap: {},
    FORMS,
    activeForm: FORMS.AUTH,
  }),

  methods: {
    isInited() {
      return this.$options.coreStore.isInited;
    },

    async handleAuthorize() {
      const isAccountExist = await this.$options.accountsStore.checkAccountExists();

      if (!isAccountExist) {
        this.activeForm = FORMS.CREATE_WALLET;
        await this.$options.accountsStore.waitAccountCreate();
      }

      const { redirectUrl, withHost } = this.queryParamsMap;

      if (!redirectUrl) return;

      const fullPath = decodeURIComponent(redirectUrl);

      if (withHost) {
        window.location.href = fullPath;
        return;
      }

      const { origin } = parseUrl(fullPath);
      const newPath = fullPath.replace(origin, '');

      this.$router.replace(newPath);
    },

    handleAuthCancel() {
      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },
  },

  mounted() {
    const { query } = this.$route;
    const { redirectUrl } = query;

    this.queryParamsMap = query;

    if (redirectUrl) {
      this.$options.authStore.setAuthParams({
        redirectUrl: decodeURIComponent(redirectUrl),
      });
    }
  },

  components: {
    Screen,
    VModalCard,
    CompositeAuthForm,
    CreateWalletForm,
  },
};
</script>

<style>
.auth-screen-centered {
  display: flex;
  justify-content: center;
}
</style>
