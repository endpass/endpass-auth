<template>
  <Code
    :challenge-type="challengeType"
    :email="email"
    @complete="onComplete"
    @recover="onRecover"
  />
</template>

<script>
import Code from './Code.interactor';

export default {
  name: 'Code',

  props: {
    challengeType: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
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
