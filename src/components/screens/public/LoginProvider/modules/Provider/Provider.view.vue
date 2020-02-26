<template>
  <loading-screen :is-loading="isLoading">
    <v-frame
      title=""
      :is-closable="isClosable"
      @close="onClose"
    >
      <slot />
    </v-frame>
  </loading-screen>
</template>

<script>
import LoadingScreen from '@/components/common/LoadingScreen';
import VFrame from '@/components/common/VFrame';

export default {
  name: 'ProviderView',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
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
  },

  components: {
    VFrame,
    LoadingScreen,
  },
};
</script>
