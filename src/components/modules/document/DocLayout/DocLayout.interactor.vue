<template>
  <doc-layout
    :is-closable="isCanClose"
    :is-returnable="isReturnable"
    @return="onReturn"
    @close="onClose"
  >
    <slot />
  </doc-layout>
</template>

<script>
import DocLayout from './DocLayout.view';
import { coreStore } from '@/store';

export default {
  name: 'DocLayoutInterface',

  coreStore,

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

  computed: {
    isCanClose() {
      return this.isClosable && this.$options.coreStore.isDialog;
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
