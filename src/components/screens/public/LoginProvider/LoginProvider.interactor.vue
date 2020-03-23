<template>
  <login-provider
    :error="error"
    :email="currentUserEmail"
    :is-closable="isDialog"
    :is-loading="isLoading"
    :oauth-login-challenge="oauthLoginChallenge"
    :challenge-type="challengeType"
    @complete="onComplete"
    @close="onClose"
  />
</template>

<script>
import get from 'lodash/get';
import { authStore, accountsStore, coreStore } from '@/store';
import LoginProvider from './modules/Provider';

export default {
  name: 'LoginProviderInteractor',

  accountsStore,
  authStore,
  coreStore,

  data: () => ({
    oauthLoginChallenge: '',
    error: '',
    isLoading: true,
  }),

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },

    isLogin() {
      return this.$options.authStore.isLogin;
    },

    currentUserEmail() {
      return get(this.$options.accountsStore.settings, 'email');
    },

    challengeType() {
      return this.$options.accountsStore.challengeType;
    },
  },

  methods: {
    onClose() {
      this.$options.coreStore.cancelAllChannels();
      this.$options.coreStore.dialogClose();
    },

    onComplete({ redirect }) {
      window.location.href = redirect;
    },
  },

  async mounted() {
    this.isLoading = true;
    this.error = '';

    const { query } = this.$route;
    const { login_challenge: oauthLoginChallenge } = query;

    this.oauthLoginChallenge = oauthLoginChallenge;
    if (!oauthLoginChallenge) {
      this.isLoading = false;
      return;
    }

    if (!this.isLogin) {
      this.$router.replace({
        name: 'PublicAuthScreen',
        query: {
          redirectUrl: encodeURI(window.location.href),
          place: 'login',
        },
      });
      return;
    }

    try {
      const res = await this.$options.accountsStore.checkOauthLoginRequirements(
        oauthLoginChallenge,
      );

      if (res.skip) {
        window.location.replace(res.redirect);
        return;
      }

      await this.$options.accountsStore.defineSettingsWithoutPermission();
    } catch (e) {
      this.error = this.$i18n.t('components.loginProvider.notWorkingError');
    }
    this.isLoading = false;
  },

  components: {
    LoginProvider,
  },
};
</script>
