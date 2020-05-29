<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.upload') }}
      {{ title }}
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
import { DOC_TYPES_TRANSLATES } from '@/constants/translates';

export default {
  name: 'Upload',

  props: {
    selectedDocumentType: {
      type: String,
      required: true,
    },
  },

  computed: {
    title() {
      return DOC_TYPES_TRANSLATES[this.selectedDocumentType];
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    onConfirm({ documentId, status }) {
      // TODO: add processing data from lower levels
      this.$emit('next', {
        documentId,
        status,
      });
    },
  },

  components: {
    VTitle,
    Sides,
  },
};
</script>
