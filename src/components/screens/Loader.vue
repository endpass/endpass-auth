<template>
  <v-frame>
    <spinner class="loader-spinner" />
  </v-frame>
</template>

<script>
import VFrame from '@/components/common/VFrame';
import Spinner from '@/components/common/Spinner';

export default {
  name: 'Loader',

  components: {
    VFrame,
    Spinner,
  },
};
</script>

<style lang="postcss">
.loader-spinner {
  position: relative;
  margin: 0 auto;
}
</style>
