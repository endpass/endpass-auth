<template>
  <div>
    <message :error="true">
      {{ hint }}
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
    hint: {
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
