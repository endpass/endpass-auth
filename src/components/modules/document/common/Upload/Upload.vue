<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.upload') }}
      {{ selectedDocumentType | documentType }}
    </v-title>
    <sides
      :document-type="selectedDocumentType"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import Sides from './Sides/Sides';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'Upload',

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

    onConfirm({ documentId, status, dateOfExpiry }) {
      this.$emit('next', {
        documentId,
        status,
        dateOfExpiry,
      });
    },
  },

  components: {
    VTitle,
    Sides,
  },
};
</script>
