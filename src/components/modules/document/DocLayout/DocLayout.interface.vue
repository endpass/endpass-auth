<template>
  <doc-layout
    :is-closable="isClosable"
    :is-returnable="isReturnable"
    @return="onReturn"
    @close="onClose"
  >
    <slot />
  </doc-layout>
</template>

<script>
import DocLayout from './DocLayout.interactor';

export default {
  name: 'DocLayoutInterface',

  props: {
    isReturnable: {
      type: Boolean,
      default: false,
    },

    isClosable: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClose() {
      this.$emit('close');
    },

    onReturn() {
      this.$emit('return');
    },
  },

  components: {
    DocLayout,
  },
};
</script>
