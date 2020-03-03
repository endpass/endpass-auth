<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.uploadDocument') }}
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
    documentType: {
      type: String,
      required: true,
    },
  },

  methods: {
    onToggle() {
      this.$emit('side-changed');
    },

    onConfirm(docId) {
      this.$emit('upload', docId);
    },
  },

  components: {
    VTitle,
    Sides,
  },
};
</script>
