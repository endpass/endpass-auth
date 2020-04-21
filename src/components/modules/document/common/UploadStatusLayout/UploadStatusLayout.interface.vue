<template>
  <upload-status-layout
    :is-pending="isPending"
    :is-verified="isVerified"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import UploadStatusLayout from './UploadStatusLayout.container';

export default {
  name: 'UploadStatusLayoutInterface',

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

  methods: {
    onContinue() {
      this.$emit('continue');
    },

    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    UploadStatusLayout,
  },
};
</script>
