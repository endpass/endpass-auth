<template>
  <div :style="style" />
</template>

<script>
export default {
  name: 'VSpacer',
  props: {
    height: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    style() {
      return {
        margin: `0 ${this.width / 2}px`,
        height: `${this.height}px`,
      };
    },
  },
};
</script>
