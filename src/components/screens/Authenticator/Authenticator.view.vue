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
  name: 'AuthenticatorView',

  props: {
    isReturnable: {
      type: Boolean,
      required: true,
    },

    isClosable: {
      type: Boolean,
      required: true,
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
    Screen,
    VFrame,
  },
};
</script>
