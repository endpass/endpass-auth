<template>
  <div>
    <slot
      :isFullScreen="isFullScreen"
      :setFullScreen="setFullScreen"
    />
  </div>
</template>

<script>
export default {
  name: 'RecorderState',

  data: () => ({
    isFullScreen: '',
  }),

  methods: {
    setFullScreen(val) {
      this.isFullScreen = val;
    },
  },
};
</script>
