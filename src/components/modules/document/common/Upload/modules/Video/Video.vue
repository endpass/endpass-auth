<template>
  <div>
    <upload-header :document-type="documentType" />
    <component
      :is="currentSide"
      :document-id.sync="documentId"
      :document-type="documentType"
      @confirm="onConfirm"
      @cancel="onCancel"
      @toggle="onToggle"
    />
  </div>
</template>

<script>
import BackSide from '../../common/BackSide';
import FrontSide from '../../common/FrontSide';
import UploadHeader from '../../common/UploadHeader';

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

  components: { UploadHeader },
};
</script>
