<template>
  <auth-form-container
    :is-returnable="isReturnable"
    :is-closable="isDialog"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot :is-closable="isDialog" />
  </auth-form-container>
</template>

<script>
import AuthFormContainer from './Authenticator.view';
import { coreStore, authStore } from '@/store';

export default {
  name: 'AuthenticatorInteractor',

  authStore,
  coreStore,

  props: {
    isReturnable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },

    isOtp() {
      // TODO: move checking logic to accountStore
      return this.$options.authStore.isOtp;
    },
  },

  watch: {
    isOtp: {
      handler(newVal) {
        this.$emit('update:is-otp', newVal);
      },
      immediate: true,
    },
  },

  components: {
    AuthFormContainer,
  },
};
</script>
