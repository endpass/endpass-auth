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
        @complete="onComplete"
        @switch="onSwitch"
        @social="handleAuth"
      />
    </template>
  </auth-form-container>
</template>

<script>
import AuthFormContainer from './Authenticator.interactor';

export default {
  name: 'AuthenticatorContainer',

  props: {
    isPasswordExist: {
      type: Boolean,
      default: false,
    },

    isOtp: {
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
          this.$router.push({ name: 'SignUp' }).catch(() => {});
          break;

        case to === 'regular-password-recovery':
          this.$router
            .push({ name: 'RegularPasswordRecovery' })
            .catch(() => {});
          break;

        case to === 'otp-recovery':
          this.$router.push({ name: 'OtpRecovery' }).catch(() => {});
          break;

        case to === 'regular-password':
        case to === 'sign-in':
        case to === 'app-code':
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

      switch (true) {
        case name === 'SignIn' && this.isPasswordExist:
          this.$router
            .push({
              name: 'RegularPassword',
            })
            .catch(() => {});
          break;

        case name === 'SignIn' && !this.isPasswordExist:
          this.$router
            .push({ name: 'RegularPasswordCreation' })
            .catch(() => {});
          break;

        case name === 'RegularPasswordCreation' && this.isOtp:
        case name === 'RegularPasswordRecovery' && this.isOtp:
          this.$router.replace({ name: 'AppCode' }).catch(() => {});
          break;

        case name === 'RegularPasswordCreation' && !this.isOtp:
        case name === 'RegularPasswordRecovery' && !this.isOtp:
        case name === 'OtpRecovery':
          this.$router.replace({ name: 'EmailCode' }).catch(() => {});
          break;

        case name === 'SignUp' && this.isOtp:
        case name === 'RegularPassword' && this.isOtp:
          this.$router.push({ name: 'AppCode' }).catch(() => {});
          break;

        case name === 'SignUp' && !this.isOtp:
        case name === 'RegularPassword' && !this.isOtp:
          this.$router.push({ name: 'EmailCode' }).catch(() => {});
          break;

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
        // TODO: await https://github.com/babel/babel-eslint/issues/530
        // eslint-disable-next-line
        const emitMsg = 'update:' + propName;
        this.$emit(emitMsg, payload[propName]);
      });
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
