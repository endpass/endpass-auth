<template>
  <component
    :is="current"
    :is-loading="isLoading"
    :error="error"
    :email="email"
    @recover="onRecover"
    @send-code="onSendCode"
    @submit="onSubmit"
  />
</template>
<script>
import AppCode from './AppCode';
import EmailCode from './EmailCode';
import SmsCode from './SmsCode';
import { CHALLENGE_TYPES } from '@/constants';

const COMPONENT_BY_TYPE = {
  [CHALLENGE_TYPES.EMAIL_OTP]: EmailCode,
  [CHALLENGE_TYPES.APP_OTP]: AppCode,
  [CHALLENGE_TYPES.SMS_OTP]: SmsCode,
};

export default {
  name: 'CodeContainer',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
    },

    challengeType: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
  },

  computed: {
    current() {
      return COMPONENT_BY_TYPE[this.challengeType];
    },
  },

  methods: {
    onSendCode() {
      this.$emit('send-code');
    },

    onRecover() {
      this.$emit('recover');
    },

    onSubmit({ code }) {
      this.$emit('submit', { code });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    SmsCode,
    EmailCode,
    AppCode,
  },
};
</script>
