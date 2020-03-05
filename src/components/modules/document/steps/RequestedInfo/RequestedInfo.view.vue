<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.requestedInformation') }}
    </v-title>
    <document-types
      :doc-types-list="docTypesList"
      :doc-type-to-status="docTypeToStatus"
      @select="onSelectType"
    />
  </div>
</template>

<script>
import DocumentTypes from './modules/DocumentTypes';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'RequestedInfoView',

  props: {
    docTypeToStatus: {
      type: Object,
      required: true,
    },

    docTypesList: {
      type: Array,
      required: true,
    },
  },

  methods: {
    onSelectType(docType) {
      this.$emit('select-document-type', docType);
    },
  },

  components: {
    VTitle,
    DocumentTypes,
  },
};
</script>
