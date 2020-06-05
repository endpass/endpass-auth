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
      @start-upload="onStartUpload"
    />
  </div>
</template>

<script>
import BackSide from './modules/BackSide';
import FrontSide from './modules/FrontSide';
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

    onStartUpload() {
      this.$emit('start-upload');
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
