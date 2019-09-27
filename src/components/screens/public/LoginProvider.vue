<template>
  <loading-screen :is-loading="isLoading">
    <v-frame
      v-if="error"
      :is-closable="false"
    >
      <message
        :error="true"
        data-test="error-message"
      >
        {{ error }}
      </message>
    </v-frame>
    <login-provider-password
      v-else
      :email="currentUserEmail"
      :login-challenge="loginChallenge"
    />
  </loading-screen>
</template>

<script>
import get from 'lodash/get';
import LoadingScreen from '@/components/common/LoadingScreen';
import LoginProviderPassword from './LoginProviderPassword';
import VFrame from '@/components/common/VFrame';
import Message from '@/components/common/Message';
import { accountsStore } from '@/store';

export default {
  name: 'LoginProvider',

  accountsStore,

  data: () => ({
    loginChallenge: null,
    error: null,
    isLoading: true,
  }),

  computed: {
    isLogin() {
      return this.$options.accountsStore.isLogin;
    },
    settings() {
      return this.$options.accountsStore.settings;
    },

    currentUserEmail() {
      return get(this.settings, 'email');
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
    LoginProviderPassword,
    VFrame,
    Message,
  },
};
</script>
