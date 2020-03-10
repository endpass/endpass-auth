<template>
  <mode-document
    :document-id="documentId"
    @continue="onCreate"
    @create="onCreate"
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
    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    ModeDocument,
  },
};
</script>
