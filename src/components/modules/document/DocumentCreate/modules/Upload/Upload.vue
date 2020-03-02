<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.uploadDocument') }}
    </v-title>
    <sides
      :document-type="documentType"
      v-on="$listeners"
      @toggle="onToggle"
    />
  </div>
</template>

<script>
import Sides from './Sides/Sides';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'Upload',

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
  },

  components: {
    VTitle,
    Sides,
  },
};
</script>
