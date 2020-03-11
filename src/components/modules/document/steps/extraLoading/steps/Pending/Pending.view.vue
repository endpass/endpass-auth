<template>
  <div class="pending-titles">
    <div class="pending-progress-container">
      <v-progress-circle
        :progress="25"
        :line-thickness="1"
      />
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
.pending-titles {
  margin: 150px 0 170px;
}

.pending-progress-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}
</style>
