<template>
  <div>
    EXTRA LOADING DOCUMENT. PENDING

    <div class="extra-loading-progress">
      <v-progress-circle :progress="25" />
    </div>
    <v-title>
      {{ $t('components.uploadDocument.pending') }}
    </v-title>
    <v-description>
      {{ $t('components.uploadDocument.pleaseWait') }}
    </v-description>
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'ExtraLoadingView',

  components: {
    VTitle,
    VDescription,
    VProgressCircle,
  },
};
</script>
<style scoped lang="postcss">
.extra-loading-progress {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
