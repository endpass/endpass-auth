<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.upload') }}
      {{ $options.DOC_TYPES_TRANSLATES[selectedDocumentType] }}
    </v-title>
    <sides
      :document-type="selectedDocumentType"
      v-on="$listeners"
      @toggle="onToggle"
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
      });
    },
  },

  components: {
    VTitle,
    Sides,
  },
};
</script>
