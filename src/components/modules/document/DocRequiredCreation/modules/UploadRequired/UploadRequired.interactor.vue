<template>
  <div>
    <slot
      :onConfirm="onConfirm"
      :onCancel="onCancel"
    />
  </div>
</template>

<script>
export default {
  name: 'UploadRequiredInteractor',

  inject: ['gateway'],

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    async onConfirm(document) {
      const { selectedDocumentType: documentType } = this;
      const documentId = document.id;
      await this.gateway.addDocTypeStatus(document);

      await this.gateway.selectDocumentForType({
        documentType,
        documentId,
      });

      this.$emit('next');
    },
  },
};
</script>
