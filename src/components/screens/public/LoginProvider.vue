<template>
  <loading-screen :is-loading="isLoading">
    <v-frame v-if="error">
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
      :login-challenge="queryParamsMap.login_challenge"
    />
  </loading-screen>
</template>

<script>
/* eslint-disable camelcase */
import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import LoadingScreen from '@/components/common/LoadingScreen';
import LoginProviderPassword from './LoginProviderPassword';
import VFrame from '@/components/common/VFrame';
import Message from '@/components/common/Message';

export default {
  name: 'LoginProvider',

  data: () => ({
    queryParamsMap: {},
    error: null,
    isLoading: true,
  }),

  computed: {
    ...mapState({
      isLogin: state => state.accounts.isLogin,
      settings: state => state.accounts.settings,
    }),

    currentUserEmail() {
      return get(this.settings, 'email');
    },
  },

  methods: {
    ...mapActions([
      'checkOauthLoginRequirements',
      'defineSettingsWithoutPermission',
    ]),
  },

  async mounted() {
    this.isLoading = true;
    this.error = null;

    const { query } = get(this.$router, 'history.current', {});
    const { href } = window.location;

    this.queryParamsMap = query;

    if (!this.queryParamsMap.login_challenge) {
      this.isLoading = false;
      return;
    }

    if (!this.isLogin) {
      this.$router.replace(
        `/public/auth?redirect_url=${encodeURI(href)}&place=login`,
      );
      return;
    }

    try {
      const res = await this.checkOauthLoginRequirements(
        this.queryParamsMap.login_challenge,
      );

      if (res.skip) {
        window.location.replace(res.redirect);
        return;
      }

      await this.defineSettingsWithoutPermission();

      this.isLoading = false;
    } catch (e) {
      this.error = 'Sorry, but login provider is not working';
      this.isLoading = false;
    }
  },

  components: {
    LoadingScreen,
    LoginProviderPassword,
    VFrame,
    Message,
  },
};
</script>
