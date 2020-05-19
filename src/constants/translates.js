import TranslateObjectFactory from '@/class/TranslateObjectFactory';

import { DOC_TYPES, DOC_STATUSES } from '@/constants';

const { $t, createGetters } = TranslateObjectFactory;

export const DOC_TYPES_TRANSLATES = createGetters({
  [DOC_TYPES.PASSPORT]: $t('constants.documentType.passport'),
  [DOC_TYPES.DRIVER_LICENSE]: $t('constants.documentType.driverLicense'),
  [DOC_TYPES.PROOF_OF_ADDRESS]: $t('constants.documentType.proofOfAddress'),
  [DOC_TYPES.ID_CARD]: $t('constants.documentType.idCard'),
});

export const DOC_STATUSES_TRANSLATES = createGetters({
  [DOC_STATUSES.DRAFT]: $t('constants.documentStatus.draft'),
  [DOC_STATUSES.RECOGNITION]: $t('constants.documentStatus.recognition'),
  [DOC_STATUSES.PENDING_REVIEW]: $t('constants.documentStatus.pendingReview'),
  [DOC_STATUSES.NOT_READABLE]: $t('constants.documentStatus.notReadable'),
  [DOC_STATUSES.NOT_VERIFIED]: $t('constants.documentStatus.notVerified'),
  [DOC_STATUSES.VERIFIED]: $t('constants.documentStatus.verified'),
});

export const SCOPES_TRANSLATES = createGetters({
  // Offline access
  offlineAccess: $t('components.scopes.offlineAccess'),
  // User
  user: $t('components.scopes.user.title'),
  userEmailRead: $t('components.scopes.user.email'),
  userAddressRead: $t('components.scopes.user.address'),
  userPhoneRead: $t('components.scopes.user.phone'),
  // ID card
  documentsIdCard: $t('components.scopes.idCard.title'),
  documentsIdCardImageRead: $t('components.scopes.idCard.image'),
  documentsIdCardStatusRead: $t('components.scopes.idCard.status'),
  documentsIdCardDataRead: $t('components.scopes.idCard.data'),
  // Passport
  documentsPassport: $t('components.scopes.passport.title'),
  documentsPassportImageRead: $t('components.scopes.passport.image'),
  documentsPassportStatusRead: $t('components.scopes.passport.status'),
  documentsPassportDataRead: $t('components.scopes.passport.data'),
  // Driver license
  documentsDriverLicense: $t('components.scopes.driverLicense.title'),
  documentsDriverLicenseImageRead: $t('components.scopes.driverLicense.image'),
  documentsDriverLicenseStatusRead: $t(
    'components.scopes.driverLicense.status',
  ),
  documentsDriverLicenseDataRead: $t('components.scopes.driverLicense.data'),
  // Proof of address
  documentsProofAddress: $t('components.scopes.proofOfAddress.title'),
  documentsProofAddressImageRead: $t('components.scopes.proofOfAddress.image'),
  documentsProofAddressStatusRead: $t(
    'components.scopes.proofOfAddress.status',
  ),
  documentsProofAddressDataRead: $t('components.scopes.proofOfAddress.data'),
});
