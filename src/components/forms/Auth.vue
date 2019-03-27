<template>
  <form data-test="auth-form" @submit.prevent="handleSubmit">
    <form-field v-if="isServerMode">
      <server-mode-select v-model="serverMode" @confirm="handleSubmit" />
    </form-field>
    <template v-if="isDefaultMode">
      <form-field>
        <message data-test="form-message">
          Log in to your Endpass account to access site actions
        </message>
      </form-field>
      <form-field v-if="error">
        <message :error="true" data-test="error-message">{{ error }}</message>
      </form-field>
      <form-field>
        <div class="auth__fields-as-line">
          <v-input
            v-model="email"
            :invalid="!isEmailValid"
            :autofocus="true"
            name="email"
            type="email"
            placeholder="Enter your email..."
            data-test="email-input"
          />
          <v-button
            :disabled="!isFormValid"
            :submit="true"
            type="primary"
            data-test="submit-button"
            >{{ primaryButtonLabel }}</v-button
          >
        </div>
      </form-field>
      <form-controls>
        <google-auth-button @error="handleOauthError" />
      </form-controls>
      <form-controls>
        <git-auth-button @error="handleOauthError" />
      </form-controls>
      <form-controls>
        <v-checkbox v-model="isTermsAccepted">
          I accept the
          <a href="https://endpass.com/terms/" target="_blank"
            >Terms of Service</a
          >
          and
          <a href="https://endpass.com/privacy/" target="_blank"
            >Privacy Policy</a
          >.
        </v-checkbox>
      </form-controls>
    </template>
  </form>
</template>

<script>
import Vue from 'vue';

import VCheckbox from '@endpass/ui/dist/components/VCheckbox';
import VFrame from '@/components/common/VFrame.vue';
import VInput from '@/components/common/VInput.vue';
import VButton from '@/components/common/VButton.vue';
import GoogleAuthButton from '@/components/common/GoogleAuthButton.vue';
import GitAuthButton from '@/components/common/GitAuthButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import ServerModeSelect from '@/components/common/ServerModeSelect';
import { IDENTITY_MODE } from '@/constants';

Vue.component(VCheckbox);

export default {
  name: 'AuthForm',

  props: {
    inited: {
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
      return !this.loading ? 'Log in' : 'Loading...';
    },

    isEmailValid() {
      return /^[a-zA-Z._\-\+0-9]+@[a-z0-9]+\.[a-z]{2,}$/g.test(this.email);
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

    handleOauthError(err) {
      this.$emit('error', err);
    },
  },
  components: {
    VCheckbox,
    VFrame,
    VButton,
    VInput,
    GoogleAuthButton,
    GitAuthButton,
    Message,
    FormField,
    FormControls,
    ServerModeSelect,
  },
};
</script>
<style>
.auth__fields-as-line {
  display: flex;
}
</style>
