<template>
  <component
    :is="currentComponent"
    :doc-types-list="docTypesList"
  />
</template>

<script>
import DocSelected from './modules/DocSelected';
import DocSpecified from './modules/DocSpecified';

export default {
  name: 'CreateSingleContainer',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },

    isDocTypeExist: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    currentComponent() {
      if (this.isDocTypeExist) {
        return DocSelected;
      }

      return DocSpecified;
    },
  },
};
</script>
