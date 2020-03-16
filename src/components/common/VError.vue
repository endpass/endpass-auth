<template>
  <div>
    <message :error="true">
      {{ label }}
    </message>

    <message :error="true">
      {{ description }}
    </message>
  </div>
</template>

<script>
import Message from '@/components/common/Message';

export default {
  name: 'VError',

  props: {
    label: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },
  },

  components: { Message },
};
</script>
