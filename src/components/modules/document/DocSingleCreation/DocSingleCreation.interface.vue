<template>
  <doc-single-creation-container
    :doc-types-list="$options.DOC_TYPES_ORDER"
    :is-doc-type-exist="isDocTypeExist"
  />
</template>

<script>
import { DOC_TYPES_ORDER } from '@/constants';
import { channelStore } from '@/store';

import DocSingleCreationContainer from './DocSingleCreation.container';

export default {
  name: 'DocSingleCreationInterface',

  channelStore,

  DOC_TYPES_ORDER,

  computed: {
    isDocTypeExist() {
      return !!this.$options.channelStore.payload.defaultDocumentType;
    },
  },

  components: {
    DocSingleCreationContainer,
  },
};
</script>
