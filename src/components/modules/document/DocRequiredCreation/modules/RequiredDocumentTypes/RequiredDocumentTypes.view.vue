<template>
  <div class="required-document-types">
    <v-title>
      {{ $t('components.uploadDocument.requestedInformation') }}
    </v-title>
    <div class="required-document-types-list">
      <document-type
        v-for="type in docRequiredTypesList"
        :key="type"
        :document-type="type"
        :document-status="getDocumentStatusByType(type)"
        :is-status-show="true"
        :is-selectable="false"
        @select="onSelectDocumentType"
      />
    </div>
    <div class="required-document-types-controls">
      <v-button
        :disabled="!isAvailableToApply"
        data-test="submit-button"
        @click="onContinue"
      >
        {{ $t('global.confirm') }}
      </v-button>
    </div>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VTitle from '@/components/common/VTitle';
import DocumentType from '@/components/modules/document/common/DocumentType';

export default {
  name: 'RequiredDocumentTypesView',

  props: {
    isAvailableToApply: {
      type: Boolean,
      required: true,
    },

    docRequiredTypesList: {
      type: Array,
      required: true,
    },

    selectedDocumentsByType: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getDocumentStatusByType(documentType) {
      const document = this.selectedDocumentsByType[documentType];
      if (!document) return '';

      return document.status;
    },

    onContinue() {
      if (this.isAvailableToApply) {
        this.$emit('create');
        return;
      }
      this.$emit('next', {
        documentId: '',
      });
    },

    onSelectDocumentType(documentType) {
      this.$emit('next', {
        selectedDocumentType: documentType,
        documentId: '',
      });
    },
  },

  components: {
    VTitle,
    DocumentType,
    VButton,
  },
};
</script>

<style lang="postcss">
.required-document-types-list {
  min-height: 296px;
}
.required-document-types-controls {
  padding-top: 20px;
}
</style>
