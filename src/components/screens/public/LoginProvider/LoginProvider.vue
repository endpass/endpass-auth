<template>
  <loading-screen :is-loading="isLoading">
    <v-frame
      title=""
      :is-closable="$options.coreStore.isDialog"
      @close="onClose"
    >
      <message
        v-if="error"
        :error="true"
        data-test="error-message"
      >
        {{ error }}
      </message>
      <login-provider-code
        v-else
        :email="currentUserEmail"
        :login-challenge="loginChallenge"
      />
    </v-frame>
  </loading-screen>
</template>

<script>
import get from 'lodash/get';
import LoadingScreen from '@/components/common/LoadingScreen';
import LoginProviderCode from './LoginProviderCode';
import VFrame from '@/components/common/VFrame';
import Message from '@/components/common/Message';
import { authStore, accountsStore, coreStore } from '@/store';

export default {
  name: 'LoginProvider',

  accountsStore,
  authStore,
  coreStore,

  data: () => ({
    loginChallenge: null,
    error: null,
    isLoading: true,
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
  },

  methods: {
    onClose() {
      this.$options.coreStore.cancelAllChannels();
      this.$options.coreStore.dialogClose();
    },
  },

  async mounted() {
    this.isLoading = true;
    this.error = null;

    const { query } = this.$route;
    const { login_challenge: loginChallenge } = query;

    this.loginChallenge = loginChallenge;
    if (!loginChallenge) {
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
    this.isLoading = false;
  },

  components: {
    LoadingScreen,
    LoginProviderCode,
    VFrame,
    Message,
  },
};
</script>
