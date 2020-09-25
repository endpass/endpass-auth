<template>
  <div>
    <slot
      :dialog-close="dialogClose"
      :version="version"
    />
  </div>
</template>

<script>
import { useBridge } from './useBridge.composable';

export default {
  name: 'BridgeInteractor',

  setup() {
    const { dialogClose, version } = useBridge();

    return {
      dialogClose,
      version,
    };
  },
};
</script>
