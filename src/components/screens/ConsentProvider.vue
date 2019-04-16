<template>
  <v-frame>
    <scopes-form
      :error="error"
      :loading="loading"
      :scopes="scopesList"
      @submit="handleScopesSubmit"
    />
  </v-frame>
</template>

<script>
/* eslint-disable camelcase */

import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import VFrame from '@/components/common/VFrame';
import ScopesForm from '@/components/forms/Scopes';

export default {
  name: 'ConsentProvider',

  data: () => ({
    queryParamsMap: {},
    error: null,
  }),

  computed: {
    ...mapState({
      loading: state => state.core.loading,
      isAuthorized: state => state.accounts.isAuthorized,
    }),

    scopesList() {
      const scopesList = get(this.queryParamsMap, 'scopes', '');

      if (!scopesList) {
        return [];
      }

      return decodeURIComponent(scopesList).split(' ');
    },
  },

  methods: {
    ...mapActions(['grantPermissionsWithHydra']),

    async handleScopesSubmit(scopes) {
      const { consent_challenge } = this.queryParamsMap;

      if (!consent_challenge) return;

      try {
        await this.grantPermissionsWithHydra({
          consentChallenge: consent_challenge,
          scopes,
        });
      } catch (err) {
        this.error = err.message;
      }
    },
  },

  mounted() {
    const { query } = get(this.$router, 'history.current', {});
    const { href } = window.location;

    this.queryParamsMap = query;

    if (!this.queryParamsMap.consent_challenge) {
      this.error =
        'You should provide consent_challenge param in url, add it and try again!';
      return;
    }

    if (!this.queryParamsMap.scopes) {
      this.error =
        'You should provide scopes param in url, add it and try again!';
      return;
    }

    if (!this.isAuthorized) {
      this.$router.replace(
        `/public/auth?redirect_url=${encodeURI(href)}&place=consent`,
      );
    }
  },

  components: {
    VFrame,
    ScopesForm,
  },
};
</script>
