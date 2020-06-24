<template>
  <authenticator
    v-bind="$attrs"
    :email.sync="email"
    :server-mode.sync="serverMode"
    :password.sync="password"
    :is-device-remembered.sync="isDeviceRemembered"
    :is-password-exist.sync="isPasswordExist"
    :is-sign-up.sync="isSignUp"
    :is-social.sync="isSocial"
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
    isDeviceRemembered: false,
    isPasswordExist: false,
    isSignUp: false,
    isSocial: false,
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
