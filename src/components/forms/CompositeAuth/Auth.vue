<template>
  <form
    data-test="auth-form"
    @submit.prevent="handleSubmit"
  >
    <form-item v-if="isServerMode && !isPublic">
      <message class="v-modal-card-title">
        {{ $t('components.serverModeSelect.identityServer') }}
      </message>
      <server-mode-select
        v-model="serverMode"
        @confirm="handleSubmit"
      />
      <v-spacer :height="4" />
      <v-divider />
    </form-item>
    <template v-if="isDefaultMode">
      <message
        class="v-modal-card-title"
        data-test="form-message"
        v-html="$t('components.auth.loginToContinue')"
      />
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
      <v-divider>or sign in with</v-divider>
      <form-row class="auth-form-social-buttons">
        <google-auth-button
          type="button"
          @submit="handleSocialSubmit"
          @error="handleOauthError"
        />
        <v-spacer :width="16" />
        <git-auth-button
          type="button"
          @submit="handleSocialSubmit"
          @error="handleOauthError"
        />
      </form-row>
      <v-divider />
      <form-row centered>
        <v-checkbox v-model="isTermsAccepted">
          {{ $t('components.auth.iAccept') }}
          <a
            href="https://endpass.com/terms/"
            target="_blank"
          >
            {{ $t('components.auth.termsOfService') }}
          </a>

          {{ $t('components.auth.and') }}
          <a
            href="https://endpass.com/privacy/"
            target="_blank"
          >
            {{ $t('components.auth.privacyPolicy') }}
          </a>
        </v-checkbox>
      </form-row>
    </template>
  </form>
</template>

<script>
import VCheckbox from '@endpass/ui/kit/VCheckbox';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VDivider from '@endpass/ui/kit/VDivider';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import VSpacer from '@/components/common/VSpacer';
import ServerModeSelect from '@/components/common/ServerModeSelect';
import GoogleAuthButton from '@/components/common/GoogleAuthButton.vue';
import GitAuthButton from '@/components/common/GitAuthButton.vue';
import Message from '@/components/common/Message.vue';
import { IDENTITY_MODE } from '@/constants';
import formMixin from '@/mixins/form';

export default {
  name: 'AuthForm',

  props: {
    isInited: {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    isServerMode: {
      type: Boolean,
      default: false,
    },

    isRegularPasswordMode: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isTermsAccepted: true,
    email: '',
    serverMode: {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    },
  }),

  computed: {
    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.login')
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
        isTermsAccepted,
        loading,
      } = this;
      const isDefaultValid = isDefaultMode && isFormValid && isTermsAccepted;

      return (isDefaultValid || isCustomMode || isLocalMode) && !loading;
    },
  },

  methods: {
    handleSubmit() {
      const { email, serverMode } = this;

      this.$emit('submit', { email, serverMode });
    },

    handleSocialSubmit() {
      this.$emit('socialSubmit');
    },

    handleOauthError(err) {
      this.$emit('error', err);
    },
  },
  mixins: [formMixin],
  components: {
    VCheckbox,
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
