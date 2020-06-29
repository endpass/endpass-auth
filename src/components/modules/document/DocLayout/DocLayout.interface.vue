<template>
  <screen @close="onClose">
    <v-frame
      :is-closable="isCanClose"
      :is-returnable="isReturnable"
      title=""
      @close="onClose"
      @return="onReturn"
    >
      <slot />
    </v-frame>
  </screen>
</template>

<script>
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
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
    Screen,
    VFrame,
  },
};
</script>
