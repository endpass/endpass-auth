import formatDate from './formatDate';
import documentType from './documentType';
import documentStatus from './documentStatus';

export default Vue => {
  formatDate(Vue);
  documentType(Vue);
  documentStatus(Vue);
};
