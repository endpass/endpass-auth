// @ts-check

/**
 * Module factory for vuex class module
 * @template T
 * @param {import('vuex').Store<{}>} store Vuex store instance
 * @param {
    new (params: import('vuex-class-modules').RegisterOptions) => T
  } Module Vuex class module
 * @param {string} name Module name
 * @returns {T} Vuex class module registered in the store
 */
export default function(store, Module, name) {
  return new Module({
    store,
    name,
  });
}
