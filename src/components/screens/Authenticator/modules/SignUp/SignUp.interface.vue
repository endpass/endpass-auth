<template>
  <sign-up
    @sign-in="onSignIn"
    @sign-up="onSignUp"
    @social="onSocial"
  />
</template>

<script>
import SignUp from './SignUp.interactor';

export default {
  name: 'SignUpInterface',

  methods: {
    onSignIn() {
      this.$emit('switch', { to: 'sign-in' });
    },

    onSignUp({ email, password, serverMode, isSignUp }) {
      this.$emit('complete', {
        email,
        password,
        serverMode,
        isSignUp,
      });
    },

    onSocial() {
      this.$emit('social');
    },
  },

  components: {
    SignUp,
  },
};
</script>
