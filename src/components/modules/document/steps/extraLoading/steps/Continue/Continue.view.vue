<template>
  <div>
    EXTRA LOADING DOCUMENT. CONTINUE

    <div class="extra-loading-progress">
      <v-progress-circle :progress="25" />
    </div>
    <v-title>
      {{ $t('components.uploadDocument.pending') }}
    </v-title>
    <v-button @click="onContinue">
      {{ $t('global.continue') }}
    </v-button>
    <v-description>
      {{ $t('components.uploadDocument.pleaseWait') }}
    </v-description>
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';
import VButton from '@endpass/ui/kit/VButton';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'ExtraLoadingView',

  methods: {
    onContinue() {
      this.$emit('continue');
    },
  },

  components: {
    VButton,
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
