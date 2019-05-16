<template>
  <v-frame :closable="false">
    <v-error
      v-if="error.show"
      :hint="error.hint"
      :description="error.description"
    />
    <scopes-form
      v-else
      :loading="isLoading"
      :scopes-list="scopesList"
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
import Spinner from '@/components/common/Spinner';

export default {
  name: 'ConsentProvider',

  data: () => ({
    queryParamsMap: {},
    initialHref: window.location.href,
    isLoading: true,
    scopesList: [],
    error: {
      show: false,
      hint: '',
      description: '',
    },
  }),

  computed: {
    ...mapState({
      inited: state => state.core.inited,
      isLogin: state => state.accounts.isLogin,
    }),
  },

  methods: {
    ...mapActions(['grantPermissionsWithHydra', 'getConsentDetails']),

    async handleScopesSubmit(scopesList) {
      this.isLoading = true;
      try {
        const { redirect } = await this.grantPermissionsWithHydra({
          consentChallenge: this.queryParamsMap.consent_challenge,
          scopesList,
        });
        window.location.href = redirect;
      } catch (err) {
        this.setError(err.message);
      }
      this.isLoading = false;
    },

    setError(hint, description = '') {
      this.error = {
        show: true,
        hint,
        description,
      };
    },

    async loadScopes() {
      this.isLoading = true;

      try {
        // load scopes
        const { requested_scope } = await this.getConsentDetails(
          this.queryParamsMap.consent_challenge,
        );
        this.scopesList = requested_scope;
      } catch (e) {
        this.setError('Something broken, when loading scopes');
      }
      this.isLoading = false;
    },
  },

  async mounted() {
    const { query } = get(this.$router, 'history.current', {});

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

    if (!this.isLogin) {
      this.$router.replace(
        `/public/auth?redirect_url=${encodeURI(
          this.initialHref,
        )}&place=consent`,
      );
      return;
    }

    await this.loadScopes();
  },

  components: {
    Spinner,
    VError,
    VFrame,
    ScopesForm,
  },
};
</script>
