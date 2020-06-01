// eslint-disable-next-line import/prefer-default-export
import { DOC_STATUSES, DOC_TYPES, UPLOAD_STATUSES } from '@/constants';

const frontStatusError = {
  status: UPLOAD_STATUSES.ERRORED,
  message: 'front-some-message',
};

const frontStatusUploaded = {
  status: UPLOAD_STATUSES.UPLOADED,
  message: 'front-some-message',
};

const backStatusNoContent = {
  status: UPLOAD_STATUSES.NO_CONTENT,
  message: 'back-some-message',
};

const backStatusProcessing = {
  status: UPLOAD_STATUSES.PROCESSING,
  message: 'back-some-message',
};

export const docStatusUploadNoContent = {
  front: frontStatusUploaded,
  back: backStatusNoContent,
};

export const docStatusUploadProcessing = {
  front: frontStatusUploaded,
  back: backStatusProcessing,
};

export const docStatusErrorProcessing = {
  front: frontStatusError,
  back: backStatusProcessing,
};

export const docStatusesMap = {
  docId: {
    front: { status: UPLOAD_STATUSES.UPLOADED },
    back: { status: UPLOAD_STATUSES.UPLOADED },
  },
};

export const document = {
  id: 'document-id-unique-value',
  status: DOC_STATUSES.PENDING_REVIEW,
  documentType: DOC_TYPES.PASSPORT,
  dateOfExpiry: 76565500,
};
