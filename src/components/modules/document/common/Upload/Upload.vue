<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.upload') }}
      {{ $options.DOC_TYPES_TRANSLATES[selectedDocumentType] }}
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

  DOC_TYPES_TRANSLATES,

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

    onConfirm(document) {
      this.$emit('confirm', document);
    },
  },

  components: {
    VTitle,
    Sides,
  },
};
</script>
