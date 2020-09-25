<template>
  <bridge-interactor #default="{ version, dialogClose }">
    <bridge-view
      :version="version"
      @close="dialogClose"
    />
  </bridge-interactor>
</template>

<script>
import BridgeInteractor from './Bridge.interactor';
import BridgeView from './Bridge.view';

export default {
  name: 'BridgeInterface',

  components: {
    BridgeView,
    BridgeInteractor,
  },
};
</script>
