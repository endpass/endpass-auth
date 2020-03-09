<template>
  <doc-required-creation
    :is-loading="isLoading"
    :doc-types-list="$options.docRequiredController.docRequiredTypes"
    :doc-type-to-status="$options.docRequiredController.docTypeToStatus"
    :documents-list="$options.docRequiredController.documentsList"
    :is-required-verified="$options.docRequiredController.isRequiredVerified"
    :is-have-bad="$options.docRequiredController.isHaveBad"
    @create="onCreate"
    @cancel="onCancel"
  />
</template>

<script>
import DocRequiredCreation from './DocRequiredCreation.state';
import createDocumentRequiredController from './DocumentRequiredController';

export default {
  name: 'DocRequiredCreationInteractor',

  docRequiredController: createDocumentRequiredController(),

  data: () => ({
    isLoading: true,
  }),

  methods: {
    onCancel() {
      this.$options.docRequiredController.cancelCreate();
    },

    onCreate() {
      this.$options.docRequiredController.finishCreate();
    },
  },

  async mounted() {
    try {
      this.isLoading = true;
      await this.$options.docRequiredController.loadDocuments();
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  },

  components: {
    DocRequiredCreation,
  },
};
</script>
