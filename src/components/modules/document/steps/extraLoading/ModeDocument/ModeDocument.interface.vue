<template>
  <mode-document
    :document-id="documentId"
    @continue="onContinue"
  />
</template>

<script>
import ModeDocument from './ModeDocument.interactor';

export default {
  name: 'ModeDocumentInterface',

  props: {
    documentId: {
      type: String,
      required: true,
    },
  },

  methods: {
    onContinue() {
      this.$emit('create');
    },
  },

  components: {
    ModeDocument,
  },
};
</script>
