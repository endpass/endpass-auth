import { DOC_TYPES_TRANSLATES } from '@/constants/translates';

export default Vue => {
  Vue.filter('documentType', docType => {
    return DOC_TYPES_TRANSLATES[docType] || '';
  });
};
