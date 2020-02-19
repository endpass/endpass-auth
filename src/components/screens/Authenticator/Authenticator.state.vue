<template>
  <authenticator
    v-bind="$attrs"
    :email.sync="email"
    :server-mode.sync="serverMode"
    :password.sync="password"
    :is-password-exist.sync="isPasswordExist"
    :is-sign-up.sync="isSignUp"
    :challenge-type.sync="challengeType"
    @authorize="onAuth"
    @cancel="onCancel"
  />
</template>

<script>
import Authenticator from './Authenticator.container';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'AuthenticatorState',

  data: () => ({
    email: '',
    serverMode: {},
    password: '',
    isPasswordExist: false,
    isSignUp: false,
    challengeType: CHALLENGE_TYPES.EMAIL_OTP,
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
