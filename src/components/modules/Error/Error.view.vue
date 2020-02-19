<template>
  <message :error="true">
    {{ error }}
  </message>
</template>

<script>
import Message from '@/components/common/Message';

export default {
  name: 'ErrorView',

  props: {
    error: {
      type: String,
      default: '',
    },
  },

  components: {
    Message,
  },
};
</script>
