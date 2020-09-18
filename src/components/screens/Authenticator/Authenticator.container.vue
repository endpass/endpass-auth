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
        :is-device-remembered="isDeviceRemembered"
        :challenge-type="challengeType"
        @complete="onComplete"
        @switch="onSwitch"
        @social="finishAuth"
      />
    </template>
  </auth-form-container>
</template>

<script>
import { CHALLENGE_TYPES } from '@/constants';
import AuthFormContainer from './Authenticator.interactor';

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
      validator(value) {
        return Object.keys(CHALLENGE_TYPES).includes(value);
      },
    },

    isDeviceRemembered: {
      type: Boolean,
      default: false,
    },

    isSocial: {
      type: Boolean,
      default: false,
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
          this.openRoute('CodeRecovery');
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
        case name === 'SignIn' && isSmsOtp && this.isSocial:
          this.replaceRoute('SmsCode');
          break;

        case name === 'SignIn' && isAppOtp && this.isSocial:
          this.replaceRoute('AppCode');
          break;

        case name === 'SignIn' && isEmailOtp && !this.isPasswordExist:
          this.openRoute('SignUp');
          break;

        case name === 'SignIn' && this.isPasswordExist:
          this.openRoute('RegularPassword');
          break;

        case name === 'SignIn' && !this.isPasswordExist:
          this.openRoute('RegularPasswordCreation');
          break;

        case name === 'CodeRecovery':
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

        case name === 'SignIn' && isSmsOtp && !this.isDeviceRemembered:
        case name === 'SignUp' && isSmsOtp && !this.isDeviceRemembered:
        case name === 'RegularPassword' && isSmsOtp && !this.isDeviceRemembered:
          this.openRoute('SmsCode');
          break;

        case name === 'SignIn' && isAppOtp && !this.isDeviceRemembered:
        case name === 'SignUp' && isAppOtp && !this.isDeviceRemembered:
        case name === 'RegularPassword' && isAppOtp && !this.isDeviceRemembered:
          this.openRoute('AppCode');
          break;

        case name === 'SignIn' && isEmailOtp && !this.isDeviceRemembered:
        case name === 'SignUp' && isEmailOtp && !this.isDeviceRemembered:
        case name === 'RegularPassword' &&
          isEmailOtp &&
          !this.isDeviceRemembered:
          this.openRoute('EmailCode');
          break;

        case name === 'SignIn' && this.isDeviceRemembered:
        case name === 'SignUp' && this.isDeviceRemembered:
        case name === 'RegularPassword' && this.isDeviceRemembered:
        case name === 'SmsCode':
        case name === 'AppCode':
        case name === 'EmailCode':
          this.finishAuth();
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
      // if do .push to the same route, throw will called (because it promise)
      // that's why we need make it empty
      this.$router.push({ name }).catch(() => {});
    },

    replaceRoute(name) {
      // if do .replace to the same route, throw will called (because it promise)
      // that's why we need make it empty
      this.$router.replace({ name }).catch(() => {});
    },

    finishAuth() {
      this.$emit('authorize');
    },
  },

  components: {
    AuthFormContainer,
  },
};
</script>
