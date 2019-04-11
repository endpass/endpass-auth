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
      const { consentChallenge } = this.params;

      if (!consentChallenge) return;

      try {
        await this.grantPermissionsWithHydra({ consentChallenge, scopes });
      } catch (err) {
        this.error = err.message;
      }
    },
  },

  mounted() {
    const { search } = window.location;

    this.params = queryParamsToObject(search);

    if (!this.params.consentChallenge) {
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
      this.$router.replace(`/public/auth${search}&place=consent`);
    }
  },

  components: {
    VFrame,
    ScopesForm,
  },
};
</script>
