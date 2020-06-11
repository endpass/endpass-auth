<template>
  <portal to="portal">
    <full-screen />
  </portal>
</template>

<script>
import FullScreen from './FullScreen.interface';

export default {
  name: 'FullScreenPortal',

  components: {
    FullScreen,
  },
};
</script>
