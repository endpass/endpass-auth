<template>
  <v-modal-card
    :is-closable="isDialog"
    @close="onClose"
  >
    <slot />
  </v-modal-card>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import { coreStore } from '@/store';

export default {
  name: 'StepContainer',

  computed: {
    isDialog() {
      return coreStore.isDialog;
    },
  },

  methods: {
    onClose() {
      this.$emit('cancel');
    },
  },

  components: {
    VModalCard,
  },
};
</script>
