<template>
  <v-frame>
    <v-error
      v-if="error.show"
      :hint="error.hint"
      :description="error.description"
    />
    <scopes-form
      v-else
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
import VError from '@/components/common/VError';

export default {
  name: 'ConsentProvider',

  data: () => ({
    queryParamsMap: {},
    error: {
      show: false,
      hint: '',
      description: '',
    },
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
        this.error = { hint: err.message };
      }
    },
    setError(hint, description = '') {
      this.error = {
        show: true,
        hint,
        description,
      };
    },
  },

  mounted() {
    const { query } = get(this.$router, 'history.current', {});
    const { href } = window.location;

    this.queryParamsMap = query;

    if (query.error) {
      this.setError(query.error_hint, query.error_description);
      return;
    }

    if (!query.consent_challenge) {
      this.setError(
        'You should provide consent_challenge param in url, add it and try again!',
      );
      return;
    }

    if (!query.scopes) {
      this.setError(
        'You should provide scopes param in url, add it and try again!',
      );
      return;
    }

    if (!this.isAuthorized) {
      this.$router.replace(
        `/public/auth?redirect_url=${encodeURI(href)}&place=consent`,
      );
    }
  },

  components: {
    VError,
    VFrame,
    ScopesForm,
  },
};
</script>
