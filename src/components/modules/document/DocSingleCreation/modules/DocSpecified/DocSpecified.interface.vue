<template>
  <doc-specified :doc-types-list="docTypesList" />
</template>

<script>
import DocSpecified from './DocSpecified.interactor';

export default {
  name: 'DocSpecifiedInterface',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },
  },

  components: {
    DocSpecified,
  },
};
</script>
