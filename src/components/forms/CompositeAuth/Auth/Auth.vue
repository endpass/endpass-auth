<template>
  <sign-in
    v-if="currentForm === FORMS.SIGN_IN"
    :is-public="isPublic"
    @social="onSocial"
    @submit="onSubmit"
    @switch="onSwitch"
  />
  <sign-up
    v-else-if="currentForm === FORMS.SIGN_UP"
    @social="onSocial"
    @submit="onSubmit"
    @switch="onSwitch"
  />
</template>

<script>
import SignIn from './SignIn';
import SignUp from './SignUp';
import { authStore } from '@/store';

const FORMS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
};

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
    currentForm: FORMS.SIGN_IN,
    FORMS,
  }),

  methods: {
    onSwitch() {
      this.currentForm =
        this.currentForm === FORMS.SIGN_UP ? FORMS.SIGN_IN : FORMS.SIGN_UP;
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
