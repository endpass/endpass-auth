<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.success') }}
    </v-title>
    <v-description>
      {{ $t('components.uploadDocument.allUploaded') }}
    </v-description>
    <v-button
      skin="quaternary"
      data-test="success-button"
      @click="onContinue"
    >
      {{ $t('global.continue') }}
    </v-button>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'SuccessView',

  methods: {
    onContinue() {
      this.$emit('continue');
    },
  },

  components: {
    VTitle,
    VDescription,
    VButton,
  },
};
</script>
