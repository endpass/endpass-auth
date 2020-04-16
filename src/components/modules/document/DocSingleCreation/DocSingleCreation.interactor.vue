<template>
  <doc-single-creation
    :doc-types-list="$options.DOC_TYPES_ORDER"
    :is-doc-type-exist="isDocTypeExist"
  />
</template>

<script>
import DocSingleCreation from './DocSingleCreation.container';
import { DOC_TYPES_ORDER } from '@/constants';
import { channelStore } from '@/store';

export default {
  name: 'DocSingleCreationInteractor',

  channelStore,

  DOC_TYPES_ORDER,

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
