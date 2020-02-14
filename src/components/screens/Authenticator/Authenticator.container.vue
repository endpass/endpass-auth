<template>
  <auth-form-container
    v-bind="$attrs"
    :is-returnable="isReturnable"
    v-on="$listeners"
    @return="onReturn"
  >
    <template v-slot="{ isClosable }">
      <router-view
        v-bind="$attrs"
        :is-closable="isClosable"
        :is-returnable="isReturnable"
        :challenge-type="challengeType"
        @complete="onComplete"
        @switch="onSwitch"
        @social="handleAuth"
      />
    </template>
  </auth-form-container>
</template>

<script>
import AuthFormContainer from './Authenticator.interactor';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'AuthenticatorContainer',

  props: {
    isPasswordExist: {
      type: Boolean,
      default: false,
    },

    challengeType: {
      type: String,
      required: true,
    },
  },

  computed: {
    isReturnable() {
      return this.$route.name !== 'SignIn';
    },
  },

  methods: {
    onReturn() {
      if (!this.isReturnable) return;

      this.$router.back();
    },

    onSwitch({ to }) {
      switch (true) {
        case to === 'sign-up':
          this.openRoute('SignUp');
          break;

        case to === 'regular-password-recovery':
          this.openRoute('RegularPasswordRecovery');
          break;

        case to === 'recovery-code':
          this.openRoute('RecoveryCode');
          break;

        case to === 'regular-password':
        case to === 'sign-in':
        case to === 'app-code':
        case to === 'sms-code':
          this.onReturn();
          break;

        default:
          throw new Error('Wrong router type with auth flow');
      }
    },

    async onComplete(payload) {
      this.updateProps(payload);

      await this.$nextTick();

      this.nextScreen();
    },

    nextScreen() {
      const { name } = this.$route;

      const isSmsOtp = this.challengeType === CHALLENGE_TYPES.SMS_OTP;
      const isAppOtp = this.challengeType === CHALLENGE_TYPES.APP_OTP;
      const isEmailOtp = this.challengeType === CHALLENGE_TYPES.EMAIL_OTP;

      switch (true) {
        case name === 'SignIn' && this.isPasswordExist:
          this.openRoute('RegularPassword');
          break;

        case name === 'SignIn' && !this.isPasswordExist:
          this.openRoute('RegularPasswordCreation');
          break;

        case name === 'RecoveryCode':
          this.replaceRoute('EmailCode');
          break;

        case name === 'RegularPasswordCreation' && isSmsOtp:
        case name === 'RegularPasswordRecovery' && isSmsOtp:
          this.replaceRoute('SmsCode');
          break;

        case name === 'RegularPasswordCreation' && isAppOtp:
        case name === 'RegularPasswordRecovery' && isAppOtp:
          this.replaceRoute('AppCode');
          break;

        case name === 'RegularPasswordCreation' && isEmailOtp:
        case name === 'RegularPasswordRecovery' && isEmailOtp:
          this.replaceRoute('EmailCode');
          break;

        case name === 'SignUp' && isSmsOtp:
        case name === 'RegularPassword' && isSmsOtp:
          this.openRoute('SmsCode');
          break;

        case name === 'SignUp' && isAppOtp:
        case name === 'RegularPassword' && isAppOtp:
          this.openRoute('AppCode');
          break;

        case name === 'SignUp' && isEmailOtp:
        case name === 'RegularPassword' && isEmailOtp:
          this.openRoute('EmailCode');
          break;

        case name === 'SmsCode':
        case name === 'AppCode':
        case name === 'EmailCode':
          this.handleAuth();
          break;

        default:
          throw new Error('Wrong router state with auth flow');
      }
    },

    updateProps(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this.$emit(`update:${propName}`, payload[propName]);
      });
    },

    openRoute(name) {
      this.$router.push({ name }).catch(() => {});
    },

    replaceRoute(name) {
      this.$router.replace({ name }).catch(() => {});
    },

    handleAuth() {
      this.$emit('authorize');
    },
  },

  components: {
    AuthFormContainer,
  },
};
</script>
