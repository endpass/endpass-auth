<template>
  <v-frame>
    <password-form
      :error="error"
      :is-loading="loading"
      @submit="handlePasswordSubmit"
    />
  </v-frame>
</template>

<script>
/* eslint-disable camelcase */

import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import VFrame from '@/components/common/VFrame';
import PasswordForm from '@/components/forms/Password';

export default {
  name: 'LoginProvider',

  data: () => ({
    queryParamsMap: {},
    error: null,
  }),

  computed: {
    ...mapState({
      loading: state => state.core.loading,
      isAuthorized: state => state.accounts.isAuthorized,
    }),
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
      this.error =
        'You should provide login_challenge param in url, add it and try again!';
      return;
    }

    if (!this.isAuthorized) {
      this.$router.replace(
        `/public/auth?redirect_url=${encodeURI(href)}&place=login`,
      );
    }
  },

  components: {
    VFrame,
    PasswordForm,
  },
};
</script>
