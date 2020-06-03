<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.requestedInformation') }}
    </v-title>
    <document-type
      v-for="type in docTypesList"
      :key="type"
      :document-type="type"
      :is-show-description="false"
      @select="onSelect"
    />
  </div>
</template>

<script>
import VTitle from '@/components/common/VTitle';
import DocumentType from '@/components/modules/document/common/DocumentType';

export default {
  name: 'DocTypesListView',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },
  },

  methods: {
    onSelect(documentType) {
      this.$emit('next', { selectedDocumentType: documentType });
    },
  },

  components: {
    DocumentType,
    VTitle,
  },
};
</script>
