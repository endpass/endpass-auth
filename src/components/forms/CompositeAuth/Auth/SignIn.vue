<template>
  <form
    data-test="auth-form"
    @submit.prevent="onSignIn"
  >
    <form-item v-if="isServerMode && !isPublic">
      <v-title>
        <span v-html="$t('components.serverModeSelect.identityServer')" />
      </v-title>
      <server-mode-select
        v-model="serverMode"
        @confirm="onSubmit"
      />
      <v-spacer :height="4" />
      <v-divider />
    </form-item>
    <template v-if="isDefaultMode">
      <v-title>
        <span v-html="$t('components.auth.loginToContinue')" />
      </v-title>
      <form-item v-if="error">
        <message
          :error="true"
          data-test="error-message"
        >
          {{ error }}
        </message>
      </form-item>
      <form-item>
        <v-input
          v-model="email"
          v-validate="'required|email'"
          data-vv-as="email"
          data-vv-name="email"
          :error="errors.first('email')"
          name="email"
          type="email"
          :placeholder="$t('components.auth.enterEmail')"
          data-test="email-input"
        />
      </form-item>
      <v-button
        :disabled="!isSubmitEnable"
        size="big"
        data-test="submit-button-auth"
      >
        {{ primaryButtonLabel }}
      </v-button>
      <v-spacer :height="3" />
      <v-divider>{{ $t('components.auth.orSignInWith') }}</v-divider>
      <form-row>
        <form-controls>
          <google-auth-button
            type="button"
            @submit="onSocialSubmit"
            @error="onOauthError"
          />
          <v-spacer :width="16" />
          <git-auth-button
            type="button"
            @submit="onSocialSubmit"
            @error="onOauthError"
          />
        </form-controls>
      </form-row>
      <v-divider />
      <form-row
        centered
        bold
      >
        {{ $t('components.auth.dontHaveAccount') }}&nbsp;
        <v-link
          href="#"
          data-test="switch-to-sign-up"
          @click.prevent="onSwitch"
        >
          {{ $t('components.auth.signUp') }}
        </v-link>
      </form-row>
    </template>
  </form>
</template>

<script>
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VDivider from '@endpass/ui/kit/VDivider';
import VLink from '@endpass/ui/kit/VLink';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import VSpacer from '@/components/common/VSpacer';
import ServerModeSelect from '@/components/common/ServerModeSelect';
import GoogleAuthButton from '@/components/common/GoogleAuthButton';
import GitAuthButton from '@/components/common/GitAuthButton';
import Message from '@/components/common/Message';
import { IDENTITY_MODE } from '@/constants';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import { coreStore, authStore } from '@/store';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'SignInForm',

  coreStore,
  authStore,

  props: {
    isPublic: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isLoading: false,
    email: '',
    error: '',
    serverMode: {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    },
  }),

  computed: {
    isRegularPasswordMode() {
      return this.$options.coreStore.isRegularPasswordMode;
    },

    isServerMode() {
      return this.$options.coreStore.isServerMode;
    },

    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('global.continue')
        : this.$i18n.t('global.loading');
    },

    isDefaultMode() {
      return this.serverMode.type === IDENTITY_MODE.DEFAULT;
    },

    isLocalMode() {
      return this.serverMode.type === IDENTITY_MODE.LOCAL;
    },

    isCustomMode() {
      return this.serverMode.type === IDENTITY_MODE.CUSTOM;
    },

    isSubmitEnable() {
      const {
        isDefaultMode,
        isLocalMode,
        isCustomMode,
        isFormValid,
        isLoading,
      } = this;
      const isDefaultValid = isDefaultMode && isFormValid;

      return (isDefaultValid || isCustomMode || isLocalMode) && !isLoading;
    },
  },

  watch: {
    email() {
      this.error = null;
    },
  },

  methods: {
    onSwitch() {
      this.$emit('switch');
    },

    onSubmit() {
      if (!this.isSubmitEnable) {
        return;
      }
      this.handleSubmit();
    },

    handleSubmit(options) {
      const { email, serverMode } = this;

      this.$emit('submit', { email, serverMode, ...options });
    },

    async onSignIn() {
      if (!this.isSubmitEnable) {
        return;
      }

      try {
        const { email, serverMode } = this;

        if (serverMode.type !== IDENTITY_MODE.DEFAULT) {
          this.handleSubmit();
          return;
        }

        this.isLoading = true;
        await this.$options.authStore.loadAuthChallenge({ email });

        if (!this.isRegularPasswordMode) {
          this.handleSubmit();
          this.isLoading = false;
          return;
        }

        const isPasswordExist = await this.$options.authStore.checkRegularPassword(
          email,
        );

        this.handleSubmit({ isPasswordExist });
      } catch (error) {
        this.error = error;
      } finally {
        this.isLoading = false;
      }
    },

    async onSocialSubmit() {
      await this.$options.authStore.waitLogin();
      this.$emit('social');
    },

    onOauthError() {
      this.error = this.$i18n.t('components.compositeAuth.authFailed');
    },
  },
  mixins: [formMixin],
  components: {
    FormControls,
    VLink,
    VTitle,
    VButton,
    VInput,
    VSpacer,
    VDivider,
    GoogleAuthButton,
    GitAuthButton,
    Message,
    FormItem,
    FormRow,
    ServerModeSelect,
  },
};
</script>
