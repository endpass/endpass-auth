<template>
  <form
    data-test="auth-form"
    @submit.prevent="handleSubmit"
  >
    <v-title>
      <span v-html="$t('components.auth.signUpToContinue')" />
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
    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password') || error"
        name="password"
        type="password"
        :placeholder="$t('components.auth.newPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <v-input
        v-model="confirmPassword"
        v-validate="'required|min:8'"
        data-vv-as="password"
        data-vv-name="confirmPassword"
        :error="errors.first('confirmPassword') || error"
        name="confirmPassword"
        type="password"
        :placeholder="$t('components.auth.confirmPassword')"
        data-test="repeat-password-input"
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
    <v-divider>{{ $t('components.auth.orRegisterWith') }}</v-divider>
    <form-item>
      <form-controls>
        <google-auth-button
          type="button"
          @submit="handleSocialSubmit"
          @error="handleOauthError"
        />
        <git-auth-button
          type="button"
          @submit="handleSocialSubmit"
          @error="handleOauthError"
        />
      </form-controls>
    </form-item>
    <form-row
      class="v-fs-12 v-lh-1-4"
      centered
    >
      <div>
        {{ $t('components.auth.iAccept') }}
        <v-link
          href="https://endpass.com/terms/"
          target="_blank"
          is-underline
        >
          <span v-html="$t('components.auth.termsOfService')" />
        </v-link>
        {{ $t('components.auth.and') }}
        <v-link
          href="https://endpass.com/privacy/"
          target="_blank"
          is-underline
        >
          <span v-html="$t('components.auth.privacyPolicy')" />
        </v-link>
      </div>
    </form-row>
    <v-divider />
    <form-row
      centered
      bold
    >
      {{ $t('components.auth.haveAccount') }}&nbsp;
      <v-link
        href="#"
        data-test="switch-to-sign-ip"
        @click.prevent="onSwitch"
      >
        {{ $t('components.auth.signIn') }}
      </v-link>
    </form-row>
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
import GoogleAuthButton from '@/components/common/GoogleAuthButton';
import GitAuthButton from '@/components/common/GitAuthButton';
import Message from '@/components/common/Message';
import { IDENTITY_MODE } from '@/constants';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import FormControls from '@/components/common/FormControls';
import { coreStore } from '@/store';

export default {
  name: 'SignUpForm',

  coreStore,

  props: {
    error: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    email: '',
    password: '',
    confirmPassword: '',
    serverMode: {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    },
  }),

  computed: {
    isLoading() {
      return this.$options.coreStore.isLoading;
    },

    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('components.auth.signUp')
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

    handleSubmit() {
      if (!this.isSubmitEnable) {
        return;
      }
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
  },
};
</script>
