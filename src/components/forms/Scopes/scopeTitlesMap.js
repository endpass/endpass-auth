import i18n from '@/locales/i18n';

export default {
  wallet: i18n.t('components.scopes.wallet'),
  'wallet:address:read': i18n.t('components.scopes.onlyAddress'),
  'wallet:accounts:read': i18n.t('components.scopes.onlyAccount'),
  user: i18n.t('components.scopes.user'),
  'user:email:read': i18n.t('components.scopes.email'),
  'user:address:read': i18n.t('components.scopes.address'),
  'user:phone:read': i18n.t('components.scopes.phone'),
  documents: i18n.t('components.scopes.documents'),
  'documents:status:read': i18n.t('components.scopes.status'),
  'documents:data:read': i18n.t('components.scopes.content'),
  'documents:image:read': i18n.t('components.scopes.image'),
};
