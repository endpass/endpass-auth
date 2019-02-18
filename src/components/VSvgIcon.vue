<template>
  <svg
    v-if="iconPath"
    :class="className"
    :width="width"
    :height="height"
    :fill="fill"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'VSvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    width: {
      type: [String, Number],
      default: '20px',
    },
    fill: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '20px',
    },
    title: {
      type: String,
      default: null,
    },
  },
  computed: {
    iconPath() {
      const iconPath = `@/assets/icons/${this.name}.svg`;
      /* eslint-disable-next-line */
      const block = require(iconPath);
      const url = get(block, 'default.url', null);

      return url;
    },
    className() {
      return `svg-icon svg-icon--${this.name}`;
    },
  },
};
</script>
