<template>
  <v-frame>
    <scopes-form
      :error="error"
      :loading="loading"
      :scopes="scopes"
      @submit="handleScopesSubmit"
    />
  </v-frame>
</template>

<script>
import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import { queryParamsToObject } from '@/util/url';
import VFrame from '@/components/common/VFrame';
import ScopesForm from '@/components/forms/Scopes';

export default {
  name: 'ConsentProvider',

  data: () => ({
    params: {},
    error: null,
  }),

  computed: {
    ...mapState({
      loading: state => state.core.loading,
      isAuthorized: state => state.accounts.isAuthorized,
    }),

    scopes() {
      const scopes = get(this.params, 'scopes', '');

      if (scopes) {
        return decodeURIComponent(scopes).split(' ');
      }

      return [];
    },
  },

  methods: {
    ...mapActions(['grantPermissionsWithHydra']),

    async handleScopesSubmit(scopes) {
      const { consent_challenge } = this.params;

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

    this.params = query;

    if (!this.params.consent_challenge) {
      this.error =
        'You should provide consent_challenge param in url, add it and try again!';
      return;
    }

    if (!this.params.scopes) {
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
