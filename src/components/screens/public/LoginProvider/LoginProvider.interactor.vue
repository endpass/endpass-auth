<template>
  <loading-screen :is-loading="isLoadingChallenge">
    <v-frame
      title=""
      :is-closable="$options.coreStore.isDialog"
      @close="onClose"
    >
      <login-provider
        :error="error"
        :email="currentUserEmail"
        :is-loading="isLoading"
        :login-challenge="loginChallenge"
        :challenge-type="challengeType"
        @complete="onComplete"
      />
    </v-frame>
  </loading-screen>
</template>

<script>
import get from 'lodash/get';
import LoadingScreen from '@/components/common/LoadingScreen';
import VFrame from '@/components/common/VFrame';
import { authStore, accountsStore, coreStore } from '@/store';
import LoginProvider from './modules/Provider';

export default {
  name: 'LoginProviderInteractor',

  accountsStore,
  authStore,
  coreStore,

  data: () => ({
    loginChallenge: null,
    error: '',
    isLoading: false,
    isLoadingChallenge: true,
  }),

  computed: {
    isLogin() {
      return this.$options.authStore.isLogin;
    },

    settings() {
      return this.$options.accountsStore.settings;
    },

    currentUserEmail() {
      return get(this.settings, 'email');
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
    this.isLoadingChallenge = true;
    this.error = '';

    const { query } = this.$route;
    const { login_challenge: loginChallenge } = query;

    this.loginChallenge = loginChallenge;
    if (!loginChallenge) {
      this.isLoadingChallenge = false;
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
        loginChallenge,
      );

      if (res.skip) {
        window.location.replace(res.redirect);
        return;
      }

      await this.$options.accountsStore.defineSettingsWithoutPermission();
    } catch (e) {
      this.error = this.$i18n.t('components.loginProvider.notWorkingError');
    }
    this.isLoadingChallenge = false;
  },

  components: {
    LoginProvider,
    LoadingScreen,
    VFrame,
  },
};
</script>
