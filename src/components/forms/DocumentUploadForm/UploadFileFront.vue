<template>
  <component
    :is="currentForm"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import FileFrontSelected from './FileFrontSelected';
import FileFront from './FileFront';

export default {
  name: 'UploadFileFront',

  props: {
    file: {
      type: File,
      default: null,
    },
  },

  computed: {
    currentForm() {
      if (this.file) {
        return FileFrontSelected;
      }

      return FileFront;
    },
  },
};
</script>
