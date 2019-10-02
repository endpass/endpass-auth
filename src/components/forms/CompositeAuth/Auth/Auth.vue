<template>
  <component
    :is="currentForm"
    :is-public="isPublic"
    @social="onSocial"
    @submit="onSubmit"
    @sign-in="onSwitch"
    @sign-up="onSwitch"
  />
</template>

<script>
import SignIn from './SignIn';
import SignUp from './SignUp';
import { authStore } from '@/store';

export default {
  name: 'Auth',

  authStore,

  props: {
    isPublic: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    currentForm: SignIn,
  }),

  methods: {
    onSwitch() {
      this.currentForm = this.currentForm === SignIn ? SignUp : SignIn;
    },

    async onSocial() {
      this.$emit('social');
    },

    async onSubmit(options) {
      this.$emit('submit', options);
    },
  },

  components: {
    SignIn,
    SignUp,
  },
};
</script>
