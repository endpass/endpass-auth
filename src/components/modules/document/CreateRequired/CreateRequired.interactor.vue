<template>
  <loading-screen :is-loading="isLoading">
    <document-create
      :types="types"
      :is-extra-loading.sync="isExtraLoading"
      :document-type.sync="documentType"
      :type-to-status="typeToStatus"
      @create="onCreate"
      @cancel="onCancel"
      @close="onClose"
    />
  </loading-screen>
</template>

<script>
import DocumentCreate from '../DocumentCreate';
import createDocumentController from './CreateRequiredController';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'CreateRequiredInteractor',

  createRequiredController: createDocumentController(),

  data() {
    return {
      types: [],
      typeToStatus: {},
      isLoading: true,
      isExtraLoading: false,
      documentType: '',
    };
  },

  methods: {
    onCancel() {
      this.documentType = '';
    },

    onClose() {
      this.$options.createRequiredController.cancelCreate();
    },

    onCreate() {
      // check status for show extra loading and first screen again
      // this.$options.createRequiredController.finishCreate();
    },
  },

  async mounted() {
    try {
      this.isLoading = true;
      const {
        types,
        typeToStatus,
      } = await this.$options.createRequiredController.getRequiredTypes();
      this.types = types;
      this.typeToStatus = typeToStatus;
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  },

  components: {
    LoadingScreen,
    DocumentCreate,
  },
};
</script>
