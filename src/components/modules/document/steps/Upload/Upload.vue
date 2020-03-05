<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.upload') }}
      {{ $options.DOC_TYPES_TRANSLATES[documentType] }}
    </v-title>
    <sides
      :document-type="documentType"
      v-on="$listeners"
      @toggle="onToggle"
      @confirm="onConfirm"
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
    onToggle() {
      this.$emit('side-changed');
    },

    onCancel() {
      this.$emit('cancel');
    },

    onConfirm({ documentId, status }) {
      // TODO: add processing data from lower levels
      this.$emit('next', {
        documentId,
        status,
        selectedDocumentType: '',
      });
    },
  },

  components: {
    VTitle,
    Sides,
  },
};
</script>
