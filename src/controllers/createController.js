// @ts-check
import createStore from '@/store/createStore';

/**
 * @typedef {import('vuex-class-modules').VuexModule} VuexModule
 * @typedef {{[key: string]: VuexModule}} ModulesMap
 * @typedef {import('vuex-class-modules').RegisterOptions} RegisterOptions
 */

/**
 * Controller factory for vuex class module
 * @template T
 * @param {
    new (params: RegisterOptions, modulesMap?: ModulesMap) => T
   } Module Vuex class module
 * @param {ModulesMap | {}} [params]
 * @returns {T} Vuex class module registered in the store
 */
export default function (Module, params = {}) {
  // eslint-disable-next-line no-proto
  const { name = 'DefaultController' } = Module.prototype.__proto__.constructor;
  const store = createStore();
  const moduleInstance = new Module(
    {
      store,
      name,
    },
    params,
  );

  return moduleInstance;
}
