<template>
  <div>
    <div class="continue-svg-icon-container">
      <v-svg-icon
        name="feature-wait"
        width="75px"
        height="75px"
      />
    </div>
    <v-title>
      {{ $t('components.uploadDocument.waitHeader') }}
    </v-title>
    <v-description>
      {{ $t('components.uploadDocument.pendingInProgress') }}
    </v-description>
    <v-button @click="onContinue">
      {{ $t('global.continue') }}
    </v-button>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
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
    VSvgIcon,
  },
};
</script>

<style scoped lang="postcss">
.continue-svg-icon-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}
</style>
