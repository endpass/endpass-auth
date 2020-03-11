<template>
  <mode-app
    :is-has-bad-status="isHasBadStatus"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import ModeApp from './ModeApp.interactor';

export default {
  name: 'ModeAppInterface',

  props: {
    isHasBadStatus: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onContinue() {
      this.$emit('next');
    },

    onCreate() {
      this.$emit('create');
    },
  },

  components: {
    ModeApp,
  },
};
</script>
