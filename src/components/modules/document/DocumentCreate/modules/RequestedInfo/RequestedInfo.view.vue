<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.requestedInformation') }}
    </v-title>
    <document-types
      :types="types"
      :type-to-status="typeToStatus"
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
    typeToStatus: {
      type: Object,
      required: true,
    },

    types: {
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
