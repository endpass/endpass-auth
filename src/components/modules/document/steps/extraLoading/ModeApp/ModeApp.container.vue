<template>
  <component
    :is="currentComponent"
    @create="onContinue"
    @continue="onContinue"
  />
</template>

<script>
import Success from '@/components/modules/document/steps/Success';
import Continue from '../steps/Continue';
import Pending from '../steps/Pending';

export default {
  name: 'ModeDocumentContainer',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    isVerified: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    currentComponent() {
      if (this.isVerified) {
        return Success;
      }

      if (this.isLoading) {
        return Pending;
      }

      return Continue;
    },
  },

  methods: {
    onContinue() {
      this.$emit('continue');
    },
  },
};
</script>
