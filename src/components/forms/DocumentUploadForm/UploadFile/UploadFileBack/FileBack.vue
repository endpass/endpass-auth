<template>
  <div>
    <upload-title :title="$t('components.uploadDocument.addBackFile')" />
    <v-description
      disabled
      :description="$t('components.uploadDocument.orDrop')"
    />
  </div>
</template>

<script>
import VDescription from '@endpass/ui/kit/VDescription';
import UploadTitle from '@/components/forms/DocumentUploadForm/shared/UploadTitle';

export default {
  name: 'FileBack',

  components: {
    UploadTitle,
    VDescription,
  },
};
</script>
