<template>
  <upload-required-interactor
    :selected-document-type="selectedDocumentType"
    #default="{ onConfirm, onCancel }"
    @next="onNext"
    @cancel="onCancelUpload"
  >
    <upload
      :selected-document-type="selectedDocumentType"
      @start-upload="onStartUpload"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </upload-required-interactor>
</template>

<script>
import Upload from '@/components/modules/document/common/Upload';
import UploadRequiredInteractor from './UploadRequired.interactor';
import { documentsRequiredStore as documentsRequiredStoreModule } from '@/store';

export default {
  name: 'UploadRequiredInterface',

  documentsRequiredStore: documentsRequiredStoreModule,

  provide() {
    const { documentsRequiredStore } = this.$options;
    return {
      gateway: {
        async addDocTypeStatus(document) {
          await documentsRequiredStore.addDocTypeStatus(document);
        },

        async selectDocumentForType({ documentType, documentId }) {
          await documentsRequiredStore.selectDocumentForType({
            documentType,
            documentId,
          });
        },
      },
    };
  },

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },
  },

  methods: {
    onCancelUpload() {
      this.$emit('cancel');
    },

    onNext() {
      this.$emit('next');
    },

    onStartUpload() {
      this.$emit('start-upload');
    },
  },

  components: {
    UploadRequiredInteractor,
    Upload,
  },
};
</script>
