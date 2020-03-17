import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';
import { accountsStore as accountsStoreModule } from '@/store';
import i18n from '@/locales/i18n';

const OPEN_URL_TIMEOUT_MS = 5000;

@Module({ generateMutationSetters: true })
class ConsentProviderController extends VuexModule {
  constructor(props, { accountsStore = accountsStoreModule }) {
    super(props);
    this.accountsStore = accountsStore;
  }

  /**
   * @param {string} url
   * @return {Promise<void>}
   */
  async openRedirectUrl(url) {
    return new Promise((resolve, reject) => {
      const isSameHost = url.indexOf(window.location.origin) === 0;
      if (!isSameHost) {
        setTimeout(() => {
          reject(i18n.t('components.consentProvider.redirectTimeoutError'));
        }, OPEN_URL_TIMEOUT_MS);
      }

      window.location.href = url;

      if (isSameHost) {
        resolve();
      }
    });
  }

  /**
   * @param {object} params
   * @param {string[]} params.scopesList
   * @return {Promise<void>}
   */
  @Action
  async grantScopes({ consentChallenge, scopesList }) {
    const { redirect } = await this.accountsStore.grantPermissionsWithOauth({
      consentChallenge,
      scopesList,
    });
    await this.openRedirectUrl(redirect);
  }

  /**
   * @param {object} params
   * @param {string} params.consentChallenge
   * @return {Promise<{scopesList: string[], skip: boolean}>}
   */
  @Action
  async loadScopes({ consentChallenge }) {
    let consentDetails = {};

    try {
      consentDetails = await this.accountsStore.getConsentDetails(
        consentChallenge,
      );
    } catch (e) {
      throw new Error(i18n.t('components.consentProvider.loadScopesError'));
    }

    const {
      requested_scope: scopesList,
      skip: isSkip,
      redirect_url: redirectUrl,
    } = consentDetails;

    if (isSkip) {
      await this.openRedirectUrl(redirectUrl);
    }

    if (!scopesList) {
      throw new Error(i18n.t('components.consentProvider.scopesRequired'));
    }

    return {
      isSkip,
      scopesList,
    };
  }
}

export default () => createController(ConsentProviderController);
