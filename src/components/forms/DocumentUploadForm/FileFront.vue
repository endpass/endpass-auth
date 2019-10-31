<template>
  <div>
    <upload-title :title="$t('components.uploadDocument.addFrontFile')" />
    <v-description
      disabled
      :description="$t('components.uploadDocument.orDrop')"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';
import UploadTitle from './shared/UploadTitle';

export default {
  name: 'FileFront',

  components: {
    UploadTitle,
    VDescription,
  },
};
</script>
