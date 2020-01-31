<template>
  <v-frame :is-loading="true" />
</template>

<script>
import VFrame from '@/components/common/VFrame';

export default {
  name: 'Loader',

  components: {
    VFrame,
  },
};
</script>
