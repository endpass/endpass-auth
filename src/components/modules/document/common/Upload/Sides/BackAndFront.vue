<template>
  <component
    :is="currentSide"
    :document-id.sync="documentId"
    :document-type="documentType"
    @confirm="onConfirm"
    @cancel="onCancel"
    @toggle="onToggle"
  />
</template>

<script>
import BackSide from './BackSide';
import FrontSide from './FrontSide';

export default {
  name: 'BackAndFront',

  props: {
    documentType: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    currentSide: FrontSide,
    documentId: '',
  }),

  methods: {
    onToggle() {
      this.currentSide = BackSide;
    },

    onConfirm(document) {
      this.$emit('confirm', document);
    },

    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>
