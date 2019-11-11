<template>
  <component
    :is="currentSide"
    :document-id.sync="documentId"
    v-bind="$attrs"
    v-on="$listeners"
    @toggle="onToggle"
  />
</template>

<script>
import BackSide from './BackSide';
import FrontSide from './FrontSide';

export default {
  name: 'Sides',

  data: () => ({
    currentSide: FrontSide,
    documentId: '',
  }),

  methods: {
    onToggle() {
      this.currentSide = BackSide;
      this.$emit('toggle');
    },
  },
};
</script>
