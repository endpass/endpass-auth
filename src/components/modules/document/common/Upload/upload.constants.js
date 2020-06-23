import TranslateObjectFactory from '@/class/TranslateObjectFactory';

const { $t, createGetters } = TranslateObjectFactory;

export const VALIDATE_DEFAULT_EXT = 'png,jpeg,jpg,pdf,tif,doc,docx';
export const ACCEPT_DEFAULT_MIME_TYPES =
  'image/png,image/jpg,image/jpeg,application/pdf,image/tif,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const VALIDATE_VIDEO_EXT = 'avi,mp4,mpeg';
export const ACCEPT_VIDEO_MIME_TYPES = 'video/avi,video/mpeg,video/mp4';

export const MAX_FILE_SIZE = 10 * 1024; // 10Mb

/**
 * @type {{ [key: string]: string }} fields UserDocument object for upload
 */
export const UPLOAD_CODE_ERRORS = createGetters({
  default: $t('store.error.uploadDocument.default'),
  409: $t('store.error.uploadDocument.exist'),
  406: $t('store.error.uploadDocument.sizeLimit'),
  422: $t('store.error.uploadDocument.invalidFile'),
});
