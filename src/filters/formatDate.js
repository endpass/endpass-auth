import { formateDate } from '@endpass/utils/date';

export default Vue => {
  Vue.filter('formatDate', (timestamp, format) => {
    if (timestamp <= 0) {
      return '';
    }
    return formateDate(timestamp, format);
  });
  Vue.filter('formatUnixDate', (timestamp, format) => {
    if (timestamp <= 0) {
      return '';
    }
    return formateDate(timestamp * 1000, format);
  });
  Vue.filter(
    'formatUnixDateTime',
    (timestamp, format = 'DD MMM YYYY, H:mmA') => {
      if (timestamp <= 0) {
        return '';
      }
      return formateDate(timestamp * 1000, format);
    },
  );
};
