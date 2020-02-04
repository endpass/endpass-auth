<template>
  <sign-in
    v-bind="$attrs"
    :is-public="isPublic"
    @sign-in="onSignIn"
    @sign-up="onSignUp"
    @social="onSocial"
  />
</template>

<script>
import SignIn from './SignIn.interactor';

export default {
  name: 'SignInInterface',

  props: {
    isPublic: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onSignUp() {
      this.$emit('switch', { to: 'sign-up' });
    },

    onSignIn({ email, serverMode, isPasswordExist, isSignUp = false }) {
      this.$emit('complete', { email, serverMode, isPasswordExist, isSignUp });
    },

    onSocial() {
      this.$emit('social');
    },
  },

  components: {
    SignIn,
  },
};
</script>
