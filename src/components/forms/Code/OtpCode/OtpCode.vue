<template>
  <div>
    <otp-form
      v-if="currentForm === FORM.OTP"
      v-bind="$attrs"
      @submit="onSubmit"
      @recover="onRecover"
    />
    <recover-form
      v-else-if="currentForm === FORM.RECOVER"
      v-bind="$attrs"
      @cancel="onRecoverCancel"
    />
  </div>
</template>

<script>
import OtpForm from './OtpForm';
import RecoverForm from './RecoverSmsForm';

const FORM = {
  OTP: 'OTP',
  RECOVER: 'RECOVER',
};

export default {
  name: 'OtpCode',

  props: {
    isClosable: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    currentForm: FORM.OTP,
    FORM,
  }),

  methods: {
    onSubmit(code) {
      this.$emit('submit', code);
    },

    onRecover() {
      this.currentForm = FORM.RECOVER;
    },

    onRecoverCancel() {
      this.currentForm = FORM.OTP;
    },

    onAuthCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    OtpForm,
    RecoverForm,
  },
};
</script>
