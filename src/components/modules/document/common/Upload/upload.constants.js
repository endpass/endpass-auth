import TranslateObjectFactory from '@/class/TranslateObjectFactory';

const { $t, createGetters } = TranslateObjectFactory;

export const ACCEPT =
  '.png,.jpeg,.jpg,.pdf,.tif,.doc,.docx,image/png,image/jpg,image/jpeg,application/pdf,image/tif,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const ACCEPT_VIDEO =
  '.avi,.mp4,.mpeg,.gif,image/gif,video/avi,video/mpeg';

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
