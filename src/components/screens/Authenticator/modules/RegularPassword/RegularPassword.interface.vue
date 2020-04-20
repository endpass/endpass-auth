<template>
  <regular-password
    :email="email"
    :is-sign-up="isSignUp"
    :is-device-remembered="isDeviceRemembered"
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

    isDeviceRemembered: {
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
