<template>
  <div
    :document-type="documentType"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script>
export default {
  name: 'RecorderContainer',

  inject: ['gateway'],

  props: {
    documentType: {
      type: String,
      default: '',
    },
  },

  methods: {
    onConfirm(document) {
      this.$emit('confirm', document);
    },

    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>
