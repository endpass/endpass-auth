<template>
  <form
    data-test="auth-form"
    @submit.prevent="handleSubmit"
  >
    <form-field v-if="isServerMode && !isPublic">
      <server-mode-select
        v-model="serverMode"
        @confirm="handleSubmit"
      />
    </form-field>
    <template v-if="isDefaultMode">
      <form-field>
        <message
          class="v-modal-card-title"
          data-test="form-message"
        >
          Log in to your Endpass account to access site actions
        </message>
      </form-field>
      <form-field v-if="error">
        <message
          :error="true"
          data-test="error-message"
        >
          {{ error }}
        </message>
      </form-field>
      <form-field>
        <v-input
          v-model="email"
          v-validate="'required|email'"
          data-vv-as="email"
          data-vv-name="email"
          :error="errors.first('email')"
          autofocus="true"
          name="email"
          type="email"
          placeholder="Enter your email..."
          data-test="email-input"
        />
      </form-field>
      <form-field>
        <v-button
          :disabled="!isFormValid"
          size="big"
          data-test="submit-button"
        >
          {{ primaryButtonLabel }}
        </v-button>
      </form-field>
      <v-divider>or sign in with</v-divider>
      <form-controls>
        <google-auth-button
          type="button"
          @submit="handleSocialSubmit"
          @error="handleOauthError"
        />
        <div class="social-buttons-gap" />
        <git-auth-button
          type="button"
          @submit="handleSocialSubmit"
          @error="handleOauthError"
        />
      </form-controls>
      <v-divider />
      <form-controls>
        <v-checkbox v-model="isTermsAccepted">
          I accept the
          <a
            href="https://endpass.com/terms/"
            target="_blank"
          >Terms of Service</a>
          and
          <a
            href="https://endpass.com/privacy/"
            target="_blank"
          >Privacy Policy</a>.
        </v-checkbox>
      </form-controls>
    </template>
  </form>
</template>

<script>
import VCheckbox from '@endpass/ui/kit/VCheckbox';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VDivider from '@endpass/ui/kit/VDivider';
import GoogleAuthButton from '@/components/common/GoogleAuthButton.vue';
import GitAuthButton from '@/components/common/GitAuthButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import ServerModeSelect from '@/components/common/ServerModeSelect';
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
      return !this.loading ? 'Login' : 'Loading...';
    },

    emailErrorMessage() {
      return this.isEmailValid ? null : 'Invalid email';
    },

    isEmailValid() {
      // eslint-disable-next-line
      return /^[a-zA-Z._\-\\+0-9]+@[a-z0-9]+\.[a-z]{2,}$/g.test(this.email);
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

    isFormValid() {
      const {
        isDefaultMode,
        isLocalMode,
        isCustomMode,
        isEmailValid,
        isTermsAccepted,
        loading,
      } = this;
      const isDefaultValid = isDefaultMode && isEmailValid && isTermsAccepted;

      return (isDefaultValid || isCustomMode || isLocalMode) && !loading;
    },
  },

  methods: {
    handleSubmit() {
      if (!this.isFormValid) return;

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
    VDivider,
    GoogleAuthButton,
    GitAuthButton,
    Message,
    FormField,
    FormControls,
    ServerModeSelect,
  },
};
</script>

<style lang="postcss">
.social-buttons-gap {
  width: 30px;
}
</style>
