<template>
  <div>
    <sign-in-form
      v-if="currentForm === FORMS.SIGN_IN"
      :error="error"
      :is-public="isPublic"
      @socialSubmit="onSocialSubmit"
      @submit="onAuthSubmit"
      @error="handleAuthError"
      @switch="onSwitchSign"
    />
    <sign-up-form
      v-if="currentForm === FORMS.SIGN_UP"
      :error="error"
      :is-public="isPublic"
      @socialSubmit="onSocialSubmit"
      @submit="onAuthSubmit"
      @error="handleAuthError"
      @switch="onSwitchSign"
    />
    <regular-password-form
      v-else-if="currentForm === FORMS.PASSWORD"
      :email="email"
      :error="error"
      @submit="onPasswordSubmit"
      @cancel="onAuthCancel"
    />
    <code-form
      v-else-if="currentForm === FORMS.CODE"
      :email="email"
      :error="error"
      :is-closable="isClosable"
      @submit="onCodeSubmit"
      @cancel="onAuthCancel"
    />
  </div>
</template>

<script>
import SignUpForm from './Auth/SignUp';
import SignInForm from './Auth/SignIn';
import RegularPasswordForm from './RegularPassword';
import CodeForm from './Code';
import { IDENTITY_MODE } from '@/constants';
import { authStore, coreStore } from '@/store';

const FORMS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  PASSWORD: 'PASSWORD',
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

  authStore,
  coreStore,

  data: () => ({
    error: null,
    password: null,
    serverMode: null,
    email: null,
    currentForm: FORMS.SIGN_IN,
    FORMS,
  }),

  computed: {
    isLogin() {
      return this.$options.authStore.isLogin;
    },

    isRegularPasswordMode() {
      return this.$options.coreStore.isRegularPasswordMode;
    },
  },

  methods: {
    onSwitchSign() {
      this.currentForm =
        this.currentForm === FORMS.SIGN_UP ? FORMS.SIGN_IN : FORMS.SIGN_UP;
    },

    async onCodeSubmit(code) {
      try {
        await this.$options.authStore.auth({
          email: this.email,
          password: this.password,
          code,
        });
        await this.$options.authStore.waitLogin();

        this.handleSubmit();
      } catch (err) {
        this.handleAuthError();
      }
    },

    onPasswordSubmit(password) {
      this.password = password;
      this.currentForm = FORMS.CODE;
    },

    async onSocialSubmit() {
      await this.$options.authStore.waitLogin();

      this.handleSubmit();
    },

    async onAuthSubmit({ email, serverMode }) {
      try {
        this.email = email;
        this.serverMode = serverMode;

        if (serverMode.type !== IDENTITY_MODE.DEFAULT) {
          this.handleSubmit();
          return;
        }

        await this.$options.authStore.loadAuthChallenge({ email });

        if (!this.isRegularPasswordMode) {
          this.currentForm = FORMS.CODE;
          return;
        }

        const isPasswordExist = await this.$options.authStore.checkRegularPassword(
          email,
        );

        this.currentForm = isPasswordExist ? FORMS.PASSWORD : FORMS.CODE;
      } catch (error) {
        this.handleAuthError();
      }
    },

    onAuthCancel() {
      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },

    handleAuthError() {
      this.error = this.$i18n.t('components.compositeAuth.authFailed');
    },

    handleSubmit() {
      this.$emit('authorize', {
        serverMode: this.serverMode,
      });
    },
  },

  components: {
    SignInForm,
    SignUpForm,
    CodeForm,
    RegularPasswordForm,
  },
};
</script>
