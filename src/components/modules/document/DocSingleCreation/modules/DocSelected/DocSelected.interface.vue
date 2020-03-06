<template>
  <doc-selected :doc-types-list="docTypesList" />
</template>

<script>
import DocSelected from './DocSelected.interactor';

export default {
  name: 'DocSelectedInterface',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },
  },

  components: {
    DocSelected,
  },
};
</script>
