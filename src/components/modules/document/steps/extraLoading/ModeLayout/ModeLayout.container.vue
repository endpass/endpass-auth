<template>
  <component
    :is="currentComponent"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import Success from '@/components/modules/document/steps/Success';
import Continue from '../steps/Continue';
import Pending from '../steps/Pending';

export default {
  name: 'ModeLayoutContainer',

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

    onCreate() {
      this.$emit('create');
    },
  },
};
</script>
