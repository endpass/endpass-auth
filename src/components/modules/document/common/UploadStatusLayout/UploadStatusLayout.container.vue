<template>
  <component
    :is="currentComponent"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import Success from './modules/Success';
import Continue from './modules/Continue';
import Pending from './modules/Pending';

export default {
  name: 'UploadStatusLayoutContainer',

  props: {
    isPending: {
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

      if (this.isPending) {
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
