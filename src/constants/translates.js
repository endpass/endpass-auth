import TranslateObjectFactory from '@/class/TranslateObjectFactory';

import { DOC_TYPES, DOC_STATUSES, PUBLIC_SCOPES } from '@/constants';

const { $t, createGetters } = TranslateObjectFactory;

export const DOC_TYPES_TRANSLATES = createGetters({
  [DOC_TYPES.PASSPORT]: $t('constants.documentType.passport'),
  [DOC_TYPES.DRIVER_LICENSE]: $t('constants.documentType.driverLicense'),
  [DOC_TYPES.PROOF_OF_ADDRESS]: $t('constants.documentType.proofOfAddress'),
  [DOC_TYPES.ID_CARD]: $t('constants.documentType.idCard'),
  [DOC_TYPES.SELFIE]: $t('constants.documentType.selfie'),
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
  // User
  [PUBLIC_SCOPES.USER]: $t('components.scopes.user.title'),
  [PUBLIC_SCOPES.USER_EMAIL_READ]: $t('components.scopes.user.email'),
  [PUBLIC_SCOPES.USER_ADDRESS_READ]: $t('components.scopes.user.address'),
  [PUBLIC_SCOPES.USER_PHONE_READ]: $t('components.scopes.user.phone'),
  // ID card
  [PUBLIC_SCOPES.DOCUMENTS_ID_CARD]: $t('components.scopes.idCard.title'),
  [PUBLIC_SCOPES.DOCUMENTS_ID_CARD_IMAGE_READ]: $t(
    'components.scopes.idCard.image',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_ID_CARD_STATUS_READ]: $t(
    'components.scopes.idCard.status',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_ID_CARD_DATA_READ]: $t(
    'components.scopes.idCard.data',
  ),
  // Passport
  [PUBLIC_SCOPES.DOCUMENTS_PASSPORT]: $t('components.scopes.passport.title'),
  [PUBLIC_SCOPES.DOCUMENTS_PASSPORT_IMAGE_READ]: $t(
    'components.scopes.passport.image',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_PASSPORT_STATUS_READ]: $t(
    'components.scopes.passport.status',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_PASSPORT_DATA_READ]: $t(
    'components.scopes.passport.data',
  ),
  // Driver license
  [PUBLIC_SCOPES.DOCUMENTS_DRIVER_LICENSE]: $t(
    'components.scopes.driverLicense.title',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_DRIVER_LICENSE_IMAGE_READ]: $t(
    'components.scopes.driverLicense.image',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_DRIVER_LICENSE_STATUS_READ]: $t(
    'components.scopes.driverLicense.status',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_DRIVER_LICENSE_DATA_READ]: $t(
    'components.scopes.driverLicense.data',
  ),
  // Proof of address
  [PUBLIC_SCOPES.DOCUMENTS_PROOF_OF_ADDRESS]: $t(
    'components.scopes.proofOfAddress.title',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_PROOF_OF_ADDRESS_IMAGE_READ]: $t(
    'components.scopes.proofOfAddress.image',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_PROOF_OF_ADDRESS_STATUS_READ]: $t(
    'components.scopes.proofOfAddress.status',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_DRIVER_LICENSE_DATA_READ]: $t(
    'components.scopes.proofOfAddress.data',
  ),
});

export const SCOPES_TOOLTIPS_TRANSLATES = createGetters({
  [PUBLIC_SCOPES.USER]: $t('components.consentProvider.tooltips.user'),
  [PUBLIC_SCOPES.DOCUMENTS_ID_CARD]: $t(
    'components.consentProvider.tooltips.idCard',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_PASSPORT]: $t(
    'components.consentProvider.tooltips.passport',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_DRIVER_LICENSE]: $t(
    'components.consentProvider.tooltips.driverLicense',
  ),
  [PUBLIC_SCOPES.DOCUMENTS_PROOF_OF_ADDRESS]: $t(
    'components.consentProvider.tooltips.proofOfAddress',
  ),
});
