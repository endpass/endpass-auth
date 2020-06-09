<template>
  <loading-screen v-if="isLoadingScreen" />
  <v-frame
    v-else
    :title="$t('components.consentProvider.title')"
    :is-closable="isClosable"
    :is-show-logo="true"
    @close="onClose"
  >
    <v-error
      v-if="isError"
      :label="errorLabel"
      :description="errorDescription"
    />
    <scopes-form
      v-if="scopesList.length > 0"
      :is-loading="isLoading"
      :scopes-list="scopesList"
      @submit="handleScopesSubmit"
    />
  </v-frame>
</template>

<script>
import LoadingScreen from '@/components/common/LoadingScreen';
import VFrame from '@/components/common/VFrame';
import ScopesForm from '@/components/forms/Scopes';
import VError from '@/components/common/VError';
import { authStore, coreStore } from '@/store';
import createConsentProviderController from './ConsentProviderController';

export default {
  name: 'ConsentProvider',

  coreStore,
  authStore,

  consentProviderController: createConsentProviderController(),

  data: () => ({
    consentChallenge: null,
    isLoading: true,
    isSkipped: false,
    scopesList: [],
    errorHint: '',
    errorDescription: '',
  }),

  computed: {
    isError() {
      return !!this.errorLabel;
    },

    errorLabel() {
      return this.errorHint || this.$options.consentProviderController.error;
    },

    isClosable() {
      return this.$options.coreStore.isDialog;
    },

    isLogin() {
      return this.$options.authStore.isLogin;
    },

    isLoadingScreen() {
      return this.isSkipped || (this.scopesList.length === 0 && !this.isError);
    },
  },

  methods: {
    async handleScopesSubmit(scopesList) {
      try {
        this.isLoading = true;
        await this.$options.consentProviderController.grantScopes({
          consentChallenge: this.consentChallenge,
          scopesList,
        });
      } catch (e) {
        this.errorHint = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    onClose() {
      this.$options.coreStore.cancelAllChannels();
      this.$options.coreStore.dialogClose();
    },

    async loadScopes() {
      try {
        this.isLoading = true;

        const {
          scopesList,
          isSkip,
        } = await this.$options.consentProviderController.loadScopes({
          consentChallenge: this.consentChallenge,
        });

        this.isSkipped = isSkip;
        this.scopesList = scopesList;
      } catch (e) {
        this.errorHint = e.message;
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

      this.errorHint = errorHint;
      this.errorDescription = errorDescription;
      return;
    }

    if (!consentChallenge) {
      this.errorHint = this.$i18n.t('components.consentProvider.urlError');
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
