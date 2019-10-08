<template>
  <component
    :is="currentForm"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import EmailCode from './EmailCode';
import OtpCode from './OtpCode';

export default {
  name: 'CodeForm',

  props: {
    isOtp: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    currentForm() {
      return this.isOtp ? OtpCode : EmailCode;
    },
  },

  components: {
    EmailCode,
    OtpCode,
  },
};
</script>
