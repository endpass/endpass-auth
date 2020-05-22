<template>
  <div class="selected-document-types">
    <v-title>
      {{ $t('components.uploadDocument.selectDocument') }}
    </v-title>
    <document-type
      v-for="document in documentsListByType"
      :key="document.id"
      :document-type="document.documentType"
      :document-status="document.status"
      :is-status-show="true"
      :is-selected="isSelected(document.id)"
      @click="onSelect(document.id)"
    />
    <div class="required-document-types-controls">
      <v-button
        data-test="continue-button"
        @click="onStartUpload"
      >
        {{ $t('components.uploadDocument.uploadNewDoc') }}
      </v-button>
    </div>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VTitle from '@/components/common/VTitle';
import DocumentType from '@/components/modules/document/common/DocumentType';

export default {
  name: 'SelectedDocumentByTypeView',

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },

    availableDocumentsList: {
      type: Array,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
      required: true,
    },
  },

  computed: {
    documentsListByType() {
      return this.availableDocumentsList.filter(
        document => document.documentType === this.selectedDocumentType,
      );
    },
  },

  methods: {
    isSelected(documentId) {
      const selectedDocument = this.selectedDocumentsByType[
        this.selectedDocumentType
      ];
      if (!selectedDocument) return false;
      return selectedDocument.id === documentId;
    },

    onStartUpload() {
      // show upload screen
      this.$emit('start-upload');
    },

    onSelect(documentId) {
      this.$emit('select', documentId);
    },
  },

  components: {
    DocumentType,
    VTitle,
    VButton,
  },
};
</script>
