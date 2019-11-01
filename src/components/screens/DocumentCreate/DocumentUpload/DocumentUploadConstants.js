export const ACCEPT =
  '.png,.jpeg,.jpg,.pdf,.tif,.doc,.docx,image/png,image/jpg,image/jpeg,application/pdf,image/tif,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const VALIDATE_ACCEPT = ACCEPT.split(',')
  .map(item => (item[0] === '.' ? item.substring(1) : item))
  .join(',');
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10Mb
