// @ts-check
/**
 *
 * @param {import('vuex').Store<{}>} store Vuex store instance
 * @return {function}
 */
export default store =>
  /**
   * Module factory for vuex class module
   * @template T
   * @param {
        new (
          params: import('vuex-class-modules').RegisterOptions,
          modules?: { [key: string]: import('vuex-class-modules').VuexModule }
        ) => T
      } Module Vuex class module
   * @param {string} name Module name
   * @param {{ [key: string]: import('vuex-class-modules').VuexModule }=} [modules]
   * @returns {T} Vuex class module registered in the store
   */
    (Module, name, modules) => {
    return new Module(
      {
        store,
        name,
      },
      modules,
    );
  };
