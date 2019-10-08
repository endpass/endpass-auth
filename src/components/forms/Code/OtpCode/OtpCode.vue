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
      @submit="onRecoverSubmit"
    />
    <message-form
      v-else-if="currentForm === FORM.MESSAGE"
      :is-closable="isClosable"
      :message="$i18n.t('components.compositeAuth.linkSentMessage')"
      @cancel="onAuthCancel"
    />
  </div>
</template>

<script>
import OtpForm from './OtpForm';
import RecoverForm from './RecoverForm';
import MessageForm from './MessageForm';

const FORM = {
  OTP: 'OTP',
  RECOVER: 'RECOVER',
  MESSAGE: 'MESSAGE',
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

    onRecoverSubmit() {
      this.currentForm = FORM.MESSAGE;
    },

    onAuthCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    OtpForm,
    RecoverForm,
    MessageForm,
  },
};
</script>
