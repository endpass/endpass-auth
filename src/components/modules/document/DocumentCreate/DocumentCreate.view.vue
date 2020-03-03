<template>
  <screen @close="onCancel">
    <v-frame
      :is-closable="isClosable"
      :is-returnable="isReturnable"
      title=""
      @close="onCancel"
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
  name: 'DocumentCreateView',

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

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    VFrame,
    Screen,
  },
};
</script>
