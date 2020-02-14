<template>
  <message
    :error="true"
    data-test="error-message"
  >
    {{ error }}
  </message>
</template>

<script>
import Message from '@/components/common/Message';

export default {
  name: 'Error',

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
