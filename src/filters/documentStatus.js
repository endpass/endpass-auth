import { DOC_STATUSES_TRANSLATES } from '@/constants/translates';

export default Vue => {
  Vue.filter('documentStatus', status => {
    return DOC_STATUSES_TRANSLATES[status] || '';
  });
};
