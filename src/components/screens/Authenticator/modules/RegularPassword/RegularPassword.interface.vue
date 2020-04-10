<template>
  <regular-password
    :email="email"
    :is-sign-up="isSignUp"
    :is-remember="isRemember"
    :is-remembered="isRemembered"
    @submit="onSubmit"
    @recover="onRecover"
  />
</template>

<script>
import RegularPassword from './RegularPassword.interactor';

export default {
  name: 'RegularPasswordInterface',

  props: {
    email: {
      type: String,
      required: true,
    },

    isSignUp: {
      type: Boolean,
      required: true,
    },

    isRemember: {
      type: Boolean,
      required: true,
    },

    isRemembered: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onSubmit({ password }) {
      this.$emit('complete', { password });
    },

    onRecover() {
      this.$emit('switch', { to: 'regular-password-recovery' });
    },
  },

  components: {
    RegularPassword,
  },
};
</script>
