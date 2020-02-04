<template>
  <authenticator
    v-bind="$attrs"
    :email.sync="email"
    :server-mode.sync="serverMode"
    :password.sync="password"
    :is-password-exist.sync="isPasswordExist"
    :is-otp.sync="isOtp"
    :is-sign-up.sync="isSignUp"
    @authorize="onAuth"
    @cancel="onCancel"
  />
</template>

<script>
import Authenticator from './Authenticator.container';

export default {
  name: 'AuthenticatorState',

  data: () => ({
    email: '',
    serverMode: {},
    password: '',
    isPasswordExist: false,
    isOtp: false,
    isSignUp: false,
  }),

  methods: {
    onAuth() {
      this.$emit('authorize', { serverMode: this.serverMode });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    Authenticator,
  },
};
</script>
