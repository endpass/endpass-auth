<template>
  <message
    v-if="!$slots.default"
    class="v-modal-card-title"
    v-html="html"
  />
  <h3
    v-else
    class="v-modal-card-title"
  >
    <slot />
  </h3>
</template>

<script>
import Message from '@/components/common/Message';

export default {
  name: 'VTitle',
  props: {
    html: {
      type: String,
      default: '',
    },
  },
  components: {
    Message,
  },
};
</script>
