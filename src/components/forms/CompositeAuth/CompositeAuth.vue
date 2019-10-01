<template>
  <div>
    <sign-in-form
      v-if="currentForm === FORMS.AUTH"
      :error="error"
      :is-public="isPublic"
      @socialSubmit="handleSocialSubmit"
      @submit="handleAuthSubmit"
      @error="handleAuthError"
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
import SignInForm from './Auth';
import RegularPasswordForm from './RegularPassword';
import CodeForm from './Code';
import { IDENTITY_MODE } from '@/constants';
import { authStore, coreStore } from '@/store';

const FORMS = {
  AUTH: 'AUTH',
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
    currentForm: FORMS.AUTH,
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

    async handleSocialSubmit() {
      await this.$options.authStore.waitLogin();

      this.handleSubmit();
    },

    async handleAuthSubmit({ email, serverMode }) {
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
    CodeForm,
    RegularPasswordForm,
  },
};
</script>
