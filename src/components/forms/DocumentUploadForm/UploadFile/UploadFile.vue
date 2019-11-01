<template>
  <component
    :is="currentForm"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import UploadFileFront from './UploadFileFront';
import UploadFileBack from './UploadFileBack';

export default {
  name: 'UploadFile',

  props: {
    isFrontSide: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    currentForm() {
      if (this.isFrontSide) {
        return UploadFileFront;
      }

      return UploadFileBack;
    },
  },
};
</script>
