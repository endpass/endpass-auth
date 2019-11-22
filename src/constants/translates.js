import TranslateObjectFactory from '@/class/TranslateObjectFactory';

import { DOC_TYPES } from '@/constants';

const { $t, createGetters } = TranslateObjectFactory;

export const CONSTANT_TRANSLATES = createGetters({
  [DOC_TYPES.PASSPORT]: $t('constants.documentType.passport'),
  [DOC_TYPES.DRIVER_LICENSE]: $t('constants.documentType.driverLicense'),
  [DOC_TYPES.PROOF_OF_ADDRESS]: $t('constants.documentType.proofOfAddress'),
  [DOC_TYPES.ID_CARD]: $t('constants.documentType.idCard'),
});

export default {
  CONSTANT_TRANSLATES,
};
