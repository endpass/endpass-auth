<template>
  <v-title>
    {{ $t('components.uploadDocument.upload') }}
    {{ $options.DOC_TYPES_TRANSLATES[documentType] }}
  </v-title>
</template>

<script>
import VTitle from '@/components/common/VTitle';
import { DOC_TYPES_TRANSLATES } from '@/constants/translates';

export default {
  name: 'UploadHeader',

  DOC_TYPES_TRANSLATES,

  props: {
    documentType: {
      type: String,
      required: true,
    },
  },

  components: {
    VTitle,
  },
};
</script>
