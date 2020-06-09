<template>
  <form
    data-test="auth-form"
    @submit.prevent="onSubmit"
  >
    <form-item v-if="isServerMode && !isPublic">
      <v-title>
        {{ $t('components.serverModeSelect.identityServer') }}
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
        {{ $t('components.auth.loginToContinue') }}
      </v-title>
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
        :is-loading="isLoading"
        size="big"
        data-test="submit-button-auth"
      >
        {{ $t('global.continue') }}
      </v-button>
      <v-spacer :height="3" />
      <v-divider>{{ $t('components.auth.orSignInWith') }}</v-divider>
      <form-row>
        <form-controls>
          <google-auth-button
            type="button"
            @submit="onSocialSubmit"
            @error="onSocialError"
          />
        </form-controls>
      </form-row>
      <v-divider />
      <form-row class="v-text-center v-fw-b">
        {{ $t('components.auth.dontHaveAccount') }}&nbsp;
        <v-link
          role="button"
          data-test="switch-to-sign-up"
          @click.prevent="onSignUp"
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
import { IDENTITY_MODE } from '@/constants';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'SignInView',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
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
    email: '',
    serverMode: {
      type: IDENTITY_MODE.DEFAULT,
      serverUrl: undefined,
    },
  }),

  computed: {
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
    error: {
      handler(msg) {
        this.$validator.errors.removeById('signInError');

        if (!msg) return;

        this.$validator.errors.add({
          id: 'signInError',
          field: 'email',
          msg,
        });
      },
      immediate: true,
    },

    email() {
      this.$emit('update:error', '');
    },
  },

  methods: {
    onSignUp() {
      this.$emit('sign-up');
    },

    onSubmit() {
      const { email, serverMode } = this;

      this.$emit('submit', { email, serverMode });
    },

    onSocialSubmit({ email }) {
      this.$emit('social', { email });
    },

    onSocialError() {
      this.$emit(
        'update:error',
        this.$i18n.t('components.compositeAuth.authFailed'),
      );
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
    FormItem,
    FormRow,
    ServerModeSelect,
  },
};
</script>
