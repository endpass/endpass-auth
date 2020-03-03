<template>
  <document-create
    :types="types"
    :type-to-status="typeToStatus"
    :is-loading="isLoading"
    :is-extra-loading="isExtraLoading"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocumentCreate from '../DocumentCreate';
import createDocumentController from './CreateRequiredController';

export default {
  name: 'DocumentCreate',

  createRequiredController: createDocumentController(),

  data() {
    return {
      types: [],
      typeToStatus: {},
      isLoading: true,
      isExtraLoading: false,
    };
  },

  methods: {
    onCancel() {
      this.$options.createRequiredController.cancelCreate();
    },

    onCreate() {
      // check status for show extra loading and first screen again
      this.$options.createRequiredController.finishCreate();
    },
  },

  async mounted() {
    const {
      types,
      typeToStatus,
    } = await this.$options.createRequiredController.getRequiredTypes();
    this.types = types;
    this.typeToStatus = typeToStatus;
    this.isLoading = false;
  },

  components: {
    DocumentCreate,
  },
};
</script>
