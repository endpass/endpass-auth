<template>
  <Code
    :challenge-type="challengeType"
    :email="email"
    :password="password"
    :is-sign-up="isSignUp"
    @complete="onComplete"
    @recover="onRecover"
  />
</template>

<script>
import Code from '@/components/modules/Code';

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
    onComplete() {
      this.$emit('complete');
    },

    onRecover() {
      this.$emit('switch', { to: 'recovery-code' });
    },
  },

  components: {
    Code,
  },
};
</script>
