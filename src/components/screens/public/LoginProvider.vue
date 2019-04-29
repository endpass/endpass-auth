<template>
  <v-frame>
    <message v-if="!isReady" :error="true" data-test="error-message">
      You should provide login_challenge param in url, add it and try again!
    </message>
    <sign-password
      v-if="isReady"
      :is-loading="isLoading"
      :error="error"
      @submit="handlePasswordSubmit"
    />
  </v-frame>
</template>

<script>
/* eslint-disable camelcase */

import get from 'lodash/get';
import { mapActions, mapState, mapGetters } from 'vuex';
import VFrame from '@/components/common/VFrame';
import Message from '@/components/common/Message';
import SignPassword from '@/components/forms/SignPassword';

export default {
  name: 'LoginProvider',

  data: () => ({
    queryParamsMap: {},
    error: null,
    isReady: true,
  }),

  computed: {
    ...mapState({
      isLoading: state => state.core.loading,
    }),
    ...mapGetters(['isAuthorized']),
  },

  methods: {
    ...mapActions(['authWithHydra']),

    async handlePasswordSubmit(password) {
      const { login_challenge } = this.queryParamsMap;

      if (!login_challenge) {
        throw new Error('Login challenge id is not defined');
      }

      try {
        const { redirect } = await this.authWithHydra({
          challengeId: login_challenge,
          password,
        });
        window.location.href = redirect;
      } catch (err) {
        this.error = err.message;
      }
    },
  },

  mounted() {
    const { query } = get(this.$router, 'history.current', {});
    const { href } = window.location;

    this.queryParamsMap = query;

    if (!this.queryParamsMap.login_challenge) {
      this.isReady = false;
      return;
    }

    if (!this.isAuthorized) {
      this.$router.replace(
        `/public/auth?redirect_url=${encodeURI(href)}&place=login`,
      );
    }
  },

  components: {
    SignPassword,
    Message,
    VFrame,
  },
};
</script>
