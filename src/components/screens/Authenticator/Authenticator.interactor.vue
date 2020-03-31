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

    challengeType() {
      return this.$options.authStore.challengeType;
    },

    isPasswordExist() {
      return this.$options.authStore.isPasswordExist;
    },

    isRemembered() {
      return this.$options.authStore.isRemembered;
    },
  },

  watch: {
    challengeType: {
      handler(newVal) {
        this.$emit('update:challenge-type', newVal);
      },
      immediate: true,
    },


    isPasswordExist: {
      handler(newVal) {
        this.$emit('update:is-password-exist', newVal);
      },
      immediate: true,
    },
    
    isRemembered: {
      handler(newVal) {
        this.$emit('update:is-remembered', newVal);
      },
      immediate: true,
    },
          },

  components: {
    AuthFormContainer,
  },
};
</script>
