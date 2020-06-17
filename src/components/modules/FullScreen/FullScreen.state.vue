<template>
  <div>
    <slot
      :isFullScreen="isFullScreen"
      :updateState="updateState"
    />
  </div>
</template>

<script>
export default {
  name: 'FullScreenState',

  data: () => ({
    isFullScreen: false,
  }),

  methods: {
    updateState({ isFullScreen }) {
      this.isFullScreen = isFullScreen;
    },
  },
};
</script>
