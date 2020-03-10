<template>
  <div>
    <div class="success-titles">
      <div class="success-svg-icon-container">
        <v-svg-icon
          name="feature-docs-fine"
          width="75px"
          height="75px"
        />
      </div>
      <v-title>
        {{ $t('global.congratulation') }}
      </v-title>
      <v-description>
        {{ $t('components.uploadDocument.allUploaded') }}
      </v-description>
    </div>
    <v-button
      data-test="success-button"
      @click="onCreate"
    >
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
  name: 'SuccessView',

  methods: {
    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    VTitle,
    VDescription,
    VButton,
    VSvgIcon,
  },
};
</script>

<style scoped lang="postcss">
.success-titles {
  margin: 156px 0;
}

.success-svg-icon-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}
</style>
