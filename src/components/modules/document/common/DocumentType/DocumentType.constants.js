import { DOC_STATUSES, DOC_TYPES } from '@/constants';

export const DOC_ICONS_BY_TYPES = {
  [DOC_TYPES.PASSPORT]: 'doc-type-passport',
  [DOC_TYPES.DRIVER_LICENSE]: 'doc-type-id',
  [DOC_TYPES.ID_CARD]: 'doc-type-id',
  [DOC_TYPES.PROOF_OF_ADDRESS]: 'doc-type-address',
};

export const DOC_STATUS_VALUES = Object.values(DOC_STATUSES);
