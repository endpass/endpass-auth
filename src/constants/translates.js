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
