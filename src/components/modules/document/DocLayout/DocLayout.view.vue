<template>
  <screen @close="onClose">
    <v-frame
      :is-closable="isClosable"
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

export default {
  name: 'DocLayoutView',

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
    onReturn() {
      this.$emit('return');
    },

    onClose() {
      this.$emit('close');
    },
  },

  components: {
    VFrame,
    Screen,
  },
};
</script>
