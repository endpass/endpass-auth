<template>
  <svgicon
    :name="name"
    :width="width"
    :height="height"
    :original="true"
    class="vue-icon svg-icon"
  />
</template>

<script>
import svgicon from 'vue-svgicon';
import './icons';

export default {
  name: 'VSvgIcon',

  props: {
    name: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: '20',
    },
    height: {
      type: String,
      default: '20',
    },
  },

  components: {
    svgicon,
  },
};
</script>
