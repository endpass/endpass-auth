import i18n from '@/locales/i18n';

export default class TranslateObjectFactory {
  static $t(value) {
    return value;
  }

  static createGetters(fields) {
    return Object.keys(fields).reduce((map, key) => {
      Object.defineProperty(map, key, {
        get() {
          return i18n.t(fields[key]);
        },
      });
      return map;
    }, {});
  }
}
