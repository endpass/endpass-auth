<template>
  <div>
    <auth-form
      v-if="currentForm === FORMS.AUTH"
      :is-public="isPublic"
      @submit="onAuthSubmit"
      @social="onAuthSocialSubmit"
    />
    <regular-password-form
      v-else-if="currentForm === FORMS.REGULAR_PASSWORD"
      :email="email"
      @submit="onPasswordSubmit"
      @cancel="onCancel"
    />
    <code-form
      v-else-if="currentForm === FORMS.CODE"
      :email="email"
      :password="password"
      :is-sign-up="isSignUp"
      :is-closable="isClosable"
      :controller="$options.authController"
      @submit="handleSubmit"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import AuthForm from './Auth';
import RegularPasswordForm from './RegularPassword';
import CodeForm from '@/components/forms/Code';
import createAuthController from './AuthController';

const FORMS = {
  AUTH: 'AUTH',
  REGULAR_PASSWORD: 'REGULAR_PASSWORD',
  CODE: 'CODE',
};

export default {
  name: 'CompositeAuth',

  props: {
    isClosable: {
      type: Boolean,
      default: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },
  },

  authController: createAuthController(),

  data: () => ({
    password: null,
    serverMode: null,
    isSignUp: false,
    email: null,
    currentForm: FORMS.AUTH,
    FORMS,
  }),

  methods: {
    onPasswordSubmit(password) {
      this.password = password;
      this.currentForm = FORMS.CODE;
    },

    onAuthSubmit(options = {}) {
      const { serverMode, email, password, isSignUp = false } = options;

      this.isSignUp = isSignUp;
      this.serverMode = serverMode;
      this.email = email;
      this.password = password;
      this.currentForm = !password ? FORMS.REGULAR_PASSWORD : FORMS.CODE;
    },

    onCancel() {
      this.$emit('cancel');
    },

    onAuthSocialSubmit() {
      this.$emit('authorize', {});
    },

    handleSubmit() {
      this.$emit('authorize', {
        serverMode: this.serverMode,
      });
    },
  },

  components: {
    AuthForm,
    CodeForm,
    RegularPasswordForm,
  },
};
</script>
