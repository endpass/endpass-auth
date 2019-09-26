// @ts-check

/**
 * Module factory for vuex class module
 * @template T
 * @param {import('vuex').Store<{}>} store Vuex store instance
 * @param {
    new (
      options: import('vuex-class-modules').RegisterOptions,
      params: { [key: string]: import('vuex-class-modules').VuexModule }
    ) => T
  } Module Vuex class module
 * @param {string} name Module name
 * @param {object} params params for module
 * @returns {T} Vuex class module registered in the store
 */
export default function(store, Module, name, params) {
  return new Module(
    {
      store,
      name,
    },
    params,
  );
}
