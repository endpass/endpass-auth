<template>
  <loading-screen v-if="isLoadingScreen" />
  <v-frame
    v-else
    :closable="false"
  >
    <v-error
      v-if="error.show"
      :hint="error.hint"
      :description="error.description"
    />
    <scopes-form
      v-if="scopesList.length > 0"
      :is-loading="isLoading"
      :scopes-list="scopesList"
      @submit="handleScopesSubmit"
      @cancel="handleAuthCancel"
    />
  </v-frame>
</template>

<script>
/* eslint-disable camelcase */
import get from 'lodash/get';
import { mapActions, mapState } from 'vuex';
import LoadingScreen from '@/components/common/LoadingScreen';
import VFrame from '@/components/common/VFrame';
import ScopesForm from '@/components/forms/Scopes';
import VError from '@/components/common/VError';

export default {
  name: 'ConsentProvider',

  data: () => ({
    queryParamsMap: {},
    initialHref: window.location.href,
    isLoading: true,
    isSkipped: false,
    scopesList: [],
    redirect: '',
    error: {
      show: false,
      hint: '',
      description: '',
    },
  }),

  computed: {
    ...mapState({
      isInited: state => state.core.isInited,
      isLogin: state => state.accounts.isLogin,
    }),
    isLoadingScreen() {
      return (
        this.isSkipped || (this.scopesList.length === 0 && !this.error.show)
      );
    },
  },

  methods: {
    ...mapActions(['grantPermissionsWithOauth', 'getConsentDetails']),

    setError(hint, description = '') {
      this.error = {
        show: true,
        hint,
        description,
      };
    },

    async handleScopesSubmit(scopesList) {
      this.isLoading = true;

      try {
        const { redirect } = await this.grantPermissionsWithOauth({
          consentChallenge: this.queryParamsMap.consent_challenge,
          scopesList,
        });
        window.location.href = redirect;
        return; // must show loader until redirect not happen
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.isLoading = false;
      }
    },

    handleAuthCancel() {
      if (window.opener) {
        window.self.opener = window.self;
        window.self.close();
      }
    },

    async loadScopes() {
      this.isLoading = true;

      try {
        const {
          requested_scope,
          skip,
          redirect_url,
        } = await this.getConsentDetails(this.queryParamsMap.consent_challenge);
        this.redirect = redirect_url;
        if (skip) {
          this.isSkipped = true;
          window.location.href = redirect_url;
          return; // must show loader until redirect not happen
        }

        this.scopesList = requested_scope;
      } catch (err) {
        this.setError(
          this.$i18n.t('components.consentProvider.loadScopesError'),
        );
      } finally {
        this.isLoading = false;
      }
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
      this.setError(this.$i18n.t('components.consentProvider.urlError'));
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
    LoadingScreen,
    VError,
    VFrame,
    ScopesForm,
  },
};
</script>
