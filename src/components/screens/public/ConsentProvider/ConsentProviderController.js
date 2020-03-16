import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import { accountsStore as accountsStoreModule } from '@/store';
import i18n from '@/locales/i18n';

const OPEN_URL_TIMEOUT_MS = 5000;

@Module({ generateMutationSetters: true })
class ConsentProviderController extends VuexModule {
  error = '';

  constructor(props, { accountsStore = accountsStoreModule }) {
    super(props);
    this.accountsStore = accountsStore;
  }

  openRedirectUrl(url) {
    window.location.href = url;
    setTimeout(() => {
      this.error = i18n.t('components.consentProvider.redirectUrl');
    }, OPEN_URL_TIMEOUT_MS);
  }

  /**
   * @param {object} params
   * @param {String[]} params.scopesList
   * @return {Promise<void>}
   */
  @Action
  async submitScopes({ consentChallenge, scopesList }) {
    try {
      const { redirect } = await this.accountsStore.grantPermissionsWithOauth({
        consentChallenge,
        scopesList,
      });
      this.openRedirectUrl(redirect);
    } catch (e) {
      this.error = e.message;
    }
  }

  /**
   * @param {object} params
   * @param {string} params.consentChallenge
   * @return {Promise<{scopesList: string[], skip: boolean}>}
   */
  @Action
  async loadScopes({ consentChallenge }) {
    let scopesList = [];
    let isSkip = false;

    try {
      const {
        requested_scope: requestedScope,
        skip,
        redirect_url: redirectUrl,
      } = await this.accountsStore.getConsentDetails(consentChallenge);

      isSkip = skip;
      scopesList = requestedScope;

      if (isSkip) {
        this.openRedirectUrl(redirectUrl);
      }

      if (!requestedScope) {
        this.error = i18n.t('components.consentProvider.scopesRequired');
      }
    } catch (e) {
      this.error = i18n.t('components.consentProvider.loadScopesError');
    }

    return {
      isSkip,
      scopesList,
    };
  }
}

export default () => createController(ConsentProviderController);
