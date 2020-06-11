// @ts-check
import { VuexModule, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';

@Module({ generateMutationSetters: true })
class RecorderController extends VuexModule {}

export default () => createController(RecorderController);
