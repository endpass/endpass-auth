<template>
  <loading-screen v-if="isLoadingScreen" />
  <v-frame
    v-else
    :is-closable="false"
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
import { mapState } from 'vuex';
import LoadingScreen from '@/components/common/LoadingScreen';
import VFrame from '@/components/common/VFrame';
import ScopesForm from '@/components/forms/Scopes';
import VError from '@/components/common/VError';
import { accountsStore } from '@/store';

export default {
  name: 'ConsentProvider',

  data: () => ({
    consentChallenge: null,
    isLoading: true,
    isSkipped: false,
    scopesList: [],
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
        const { redirect } = await accountsStore.grantPermissionsWithOauth({
          consentChallenge: this.consentChallenge,
          scopesList,
        });
        window.location.href = redirect;
      } catch (err) {
        this.setError(err.message);
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
          requested_scope: requestedScope,
          skip,
          redirect_url: redirectUrl,
        } = await accountsStore.getConsentDetails(this.consentChallenge);

        if (skip) {
          this.isSkipped = true;
          window.location.href = redirectUrl;
        }

        this.scopesList = requestedScope;
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
    const { query } = this.$route;
    const { consent_challenge: consentChallenge, error } = query;

    this.consentChallenge = consentChallenge;

    if (error) {
      const {
        error_hint: errorHint,
        error_description: errorDescription,
      } = query;
      this.setError(errorHint, errorDescription);
      return;
    }

    if (!consentChallenge) {
      this.setError(this.$i18n.t('components.consentProvider.urlError'));
      return;
    }

    if (!this.isLogin) {
      this.$router.replace({
        name: 'PublicAuthScreen',
        query: {
          redirectUrl: encodeURI(window.location.href),
          place: 'consent',
        },
      });
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
