<template>
  <doc-single-creation
    :doc-types-list="$options.DOC_TYPES_LIST"
    :is-doc-type-exist="isDocTypeExist"
  />
</template>

<script>
import DocSingleCreation from './DocSingleCreation.container';
import { DOC_TYPES } from '@/constants';
import { channelStore } from '@/store';

export default {
  name: 'DocSingleCreationInteractor',

  channelStore,

  DOC_TYPES_LIST: [
    DOC_TYPES.PASSPORT,
    DOC_TYPES.DRIVER_LICENSE,
    DOC_TYPES.ID_CARD,
    DOC_TYPES.PROOF_OF_ADDRESS,
  ],

  computed: {
    isDocTypeExist() {
      return !!this.$options.channelStore.payload.defaultDocumentType;
    },
  },

  components: {
    DocSingleCreation,
  },
};
</script>
