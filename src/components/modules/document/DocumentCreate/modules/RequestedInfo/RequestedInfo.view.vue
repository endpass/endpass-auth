<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.requestedInformation') }}
    </v-title>
    <document-types
      :statuses="statuses"
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
    statuses: {
      type: Array,
      default: () => [],
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
