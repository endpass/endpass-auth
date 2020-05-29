<template>
  <component
    :is="currentSide"
    :document-type="documentType"
    @confirm="onConfirm"
    @cancel="onCancel"
    @toggle="onToggle"
  />
</template>

<script>
import BackAndFront from './BackAndFront';
import FrontSideOnly from './FrontSideOnly';
import { DOC_TYPES } from '@/constants';

const frontSideOnly = [DOC_TYPES.PASSPORT, DOC_TYPES.PROOF_OF_ADDRESS];

export default {
  name: 'Sides',

  props: {
    documentType: {
      type: String,
      default: '',
    },
  },

  computed: {
    currentSide() {
      if (frontSideOnly.includes(this.documentType)) {
        return FrontSideOnly;
      }
      return BackAndFront;
    },
  },

  methods: {
    onConfirm({ documentId, status }) {
      this.$emit('confirm', { documentId, status });
    },

    onCancel() {
      this.$emit('cancel');
    },

    onToggle() {
      this.$emit('toggle');
    },
  },
};
</script>
