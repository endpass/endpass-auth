import i18n from '@/locales/i18n';

export default {
  wallet: i18n.t('components.scopes.scopeWallet'),
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
  'documents:passport:status:read': i18n.t('components.scopes.passport.status'),
  'documents:passport:data:read': i18n.t('components.scopes.passport.data'),
  'documents:passport:image:read': i18n.t('components.scopes.passport.image'),
  'documents:proof_address:status:read': i18n.t(
    'components.scopes.proofOfAddress.status',
  ),
  'documents:proof_address:data:read': i18n.t(
    'components.scopes.proofOfAddress.data',
  ),
  'documents:proof_address:image:read': i18n.t(
    'components.scopes.proofOfAddress.image',
  ),
  'documents:driver_license:status:read': i18n.t(
    'components.scopes.driverLicense.status',
  ),
  'documents:driver_license:data:read': i18n.t(
    'components.scopes.driverLicense.data',
  ),
  'documents:driver_license:image:read': i18n.t(
    'components.scopes.driverLicense.image',
  ),
  'documents:id_card:status:read': i18n.t('components.scopes.idCard.status'),
  'documents:id_card:data:read': i18n.t('components.scopes.idCard.data'),
  'documents:id_card:image:read': i18n.t('components.scopes.idCard.image'),
};
