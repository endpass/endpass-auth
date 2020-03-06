<template>
  <mode-app
    :document-id="documentId"
    @continue="onContinue"
  />
</template>

<script>
import ModeApp from './ModeApp.interactor';

export default {
  name: 'ModeAppInterface',

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
    ModeApp,
  },
};
</script>
