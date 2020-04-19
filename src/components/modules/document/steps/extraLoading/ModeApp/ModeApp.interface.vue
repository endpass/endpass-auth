<template>
  <mode-app
    :is-all-has-appropriate-status="isAllHasAppropriateStatus"
    @continue="onContinue"
    @create="onCreate"
  />
</template>

<script>
import ModeApp from './ModeApp.interactor';

export default {
  name: 'ModeAppInterface',

  props: {
    isAllHasAppropriateStatus: {
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
