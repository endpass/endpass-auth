<template>
  <create-single
    :doc-types-list="$options.DOC_TYPES_LIST"
    :is-doc-type-exist="isDocTypeExist"
  />
</template>

<script>
import CreateSingle from './CreateSingle.container';
import { DOC_TYPES } from '@/constants';
import { channelStore } from '@/store';

export default {
  name: 'CreateSingleInteractor',

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
    CreateSingle,
  },
};
</script>
