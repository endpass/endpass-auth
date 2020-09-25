<template>
  <v-frame @close="onClose">
    <v-description>{{ $t('global.version') }}{{ version }}</v-description>
    <div
      class="bridge-loading-container"
      data-test="bridge-loader"
    >
      <v-progress-circle
        :progress="25"
        :line-thickness="1"
      />
    </div>
  </v-frame>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';
import VFrame from '@/components/common/VFrame';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'BridgeView',

  props: {
    version: {
      type: String,
      required: true,
    },
  },

  setup(props, context) {
    const onClose = () => context.emit('close');

    return {
      onClose,
    };
  },

  components: {
    VFrame,
    VDescription,
    VProgressCircle,
  },
};
</script>

<style scoped lang="postcss">
.bridge-loading-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}
</style>
