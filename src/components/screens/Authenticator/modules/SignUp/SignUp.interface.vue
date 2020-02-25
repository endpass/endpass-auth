<template>
  <sign-up
    :email="email"
    @sign-in="onSignIn"
    @sign-up="onSignUp"
    @social="onSocial"
  />
</template>

<script>
import SignUp from './SignUp.interactor';

export default {
  name: 'SignUpInterface',

  props: {
    email: {
      type: String,
      default: '',
    },
  },

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
