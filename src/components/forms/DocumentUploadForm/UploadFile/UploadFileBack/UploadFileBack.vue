<template>
  <component
    :is="currentForm"
    v-bind="$props"
    v-on="$listeners"
  />
</template>

<script>
import FileBackSelected from './FileBackSelected';
import FileBack from './FileBack';

export default {
  name: 'UploadFileBack',

  props: {
    file: {
      type: File,
      default: null,
    },
  },

  computed: {
    currentForm() {
      if (this.file) {
        return FileBackSelected;
      }

      return FileBack;
    },
  },
};
</script>
