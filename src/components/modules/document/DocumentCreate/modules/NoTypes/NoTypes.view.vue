<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.requestedInformation') }}
    </v-title>
    <v-description>
      {{ $t('components.uploadDocument.noTypes') }}
    </v-description>
  </div>
</template>

<script>
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'NoTypesView',

  components: {
    VTitle,
    VDescription,
  },
};
</script>
