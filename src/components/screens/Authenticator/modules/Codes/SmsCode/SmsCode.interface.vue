<template>
  <sms-code
    v-bind="$attrs"
    @auth="onAuth"
  />
</template>

<script>
import SmsCode from './SmsCode.interactor';

export default {
  name: 'SmsCodeInterface',

  methods: {
    onAuth() {
      this.$emit('complete');
    },
  },

  components: {
    SmsCode,
  },
};
</script>
