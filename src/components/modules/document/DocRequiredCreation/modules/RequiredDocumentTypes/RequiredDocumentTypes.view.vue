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
        :is-show-description="true"
        :is-selectable="false"
        :total-documents="getTotalByDocumentType(type)"
        :document="getDocumentByType(type)"
        @select="onSelectDocumentType"
      />
    </div>
    <div class="required-document-types-controls">
      <v-button
        :disabled="!isAvailableToFinish"
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
    isAvailableToFinish: {
      type: Boolean,
      required: true,
    },

    availableDocumentsList: {
      type: Array,
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
    getTotalByDocumentType(documentType) {
      return this.availableDocumentsList.reduce(
        (count, document) =>
          (document.documentType === documentType ? count + 1 : count),
        0,
      );
    },

    getDocumentByType(documentType) {
      const document = this.selectedDocumentsByType[documentType];
      if (!document) return null;

      return document;
    },

    onContinue() {
      if (this.isAvailableToFinish) {
        this.$emit('finish');
        return;
      }
      this.$emit('next');
    },

    onSelectDocumentType(documentType) {
      this.$emit('next', {
        selectedDocumentType: documentType,
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
