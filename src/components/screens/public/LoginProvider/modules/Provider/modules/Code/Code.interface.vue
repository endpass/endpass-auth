<template>
  <Code
    v-bind="$attrs"
    @complete="onComplete"
    @recover="onRecover"
  />
</template>

<script>
import Code from './Code.interactor';

export default {
  name: 'CodeInterface',

  challengeType: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  isSignUp: {
    type: Boolean,
    required: true,
  },

  methods: {
    onComplete({ redirect }) {
      this.$emit('complete', { redirect });
    },

    onRecover() {
      this.$emit('recover');
    },
  },

  components: {
    Code,
  },
};
</script>
