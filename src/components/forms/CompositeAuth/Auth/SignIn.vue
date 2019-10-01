<template>
  <form
    data-test="auth-form"
    @submit.prevent="onSubmit"
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
      <form-row class="auth-form-social-buttons">
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
import { coreStore } from '@/store';

export default {
  name: 'SignInForm',

  coreStore,

  props: {
    error: {
      type: String,
      default: null,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    email: '',
    serverMode: {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    },
  }),

  computed: {
    isServerMode() {
      return this.$options.coreStore.isServerMode;
    },

    isLoading() {
      return this.$options.coreStore.isLoading;
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

  methods: {
    onSwitch() {
      this.$emit('switch');
    },

    onSubmit() {
      if (!this.isSubmitEnable) {
        return;
      }
      const { email, serverMode } = this;

      this.$emit('submit', { email, serverMode });
    },

    onSocialSubmit() {
      this.$emit('socialSubmit');
    },

    onOauthError(err) {
      this.$emit('error', err);
    },
  },
  mixins: [formMixin],
  components: {
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

<style lang="postcss">
@media (max-width: 360px) {
  .auth-form-social-buttons {
    display: block;
  }

  .auth-form-social-buttons > button:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
