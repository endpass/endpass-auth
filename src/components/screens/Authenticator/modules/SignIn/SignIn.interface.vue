<template>
  <sign-in
    v-bind="$attrs"
    :is-public="isPublic"
    :challenge-type="challengeType"
    @sign-in="onSignIn"
    @sign-in-social="onSignInSocial"
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

    challengeType: {
      type: String,
      required: true,
    },
  },

  methods: {
    onSignUp() {
      this.$emit('switch', { to: 'sign-up' });
    },

    onSignIn({ email, serverMode, isSignUp = false }) {
      this.$emit('complete', { email, serverMode, isSignUp });
    },

    onSignInSocial({ email }) {
      this.$emit('complete', { email, isSocial: true });
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
