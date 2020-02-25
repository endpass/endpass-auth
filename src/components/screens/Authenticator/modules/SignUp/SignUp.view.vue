<template>
  <form
    data-test="auth-form"
    @submit.prevent="onSubmit"
  >
    <v-title>
      {{ $t('components.auth.signUpToContinue') }}
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
    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password')"
        name="password"
        type="password"
        required
        :placeholder="$t('components.auth.password')"
        data-test="password-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <v-input
        v-model="confirmPassword"
        v-validate="{ required: true, confirmed: password }"
        data-vv-as="password"
        data-vv-name="confirmPassword"
        :error="errors.first('confirmPassword')"
        name="confirmPassword"
        type="password"
        :placeholder="$t('components.auth.confirmPassword')"
        data-test="confirm-password-input"
      />
    </form-item>
    <v-button
      :disabled="!isSubmitEnable"
      :is-loading="isLoading"
      size="big"
      data-test="submit-button-auth"
    >
      {{ $t('components.auth.signUp') }}
    </v-button>
    <v-spacer :height="3" />
    <v-divider>{{ $t('components.auth.orRegisterWith') }}</v-divider>
    <form-item>
      <form-controls>
        <google-auth-button
          type="button"
          @submit="onSocial"
          @error="onOauthError"
        />
        <git-auth-button
          type="button"
          @submit="onSocial"
          @error="onOauthError"
        />
      </form-controls>
    </form-item>
    <form-row class="v-fs-12 v-lh-1-4 v-text-center">
      <div>
        {{ $t('components.auth.iAccept') }}
        <v-link
          href="https://endpass.com/terms/"
          target="_blank"
          is-underline
        >
          {{ $t('components.auth.termsOfService') }}
        </v-link>
        {{ $t('components.auth.and') }}
        <v-link
          href="https://endpass.com/privacy/"
          target="_blank"
          is-underline
        >
          {{ $t('components.auth.privacyPolicy') }}
        </v-link>
      </div>
    </form-row>
    <v-divider />
    <form-row class="v-text-center v-fw-b">
      {{ $t('components.auth.haveAccount') }}&nbsp;
      <v-link
        role="button"
        data-test="switch-to-sign-in"
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
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'SignUpView',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    initialEmail: {
      type: String,
      default: '',
    },

    error: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      email: this.initialEmail,
      password: '',
      confirmPassword: '',
    };
  },

  computed: {
    isSubmitEnable() {
      const { isFormValid, isLoading } = this;

      return isFormValid && !isLoading;
    },
  },

  watch: {
    error: {
      handler(msg) {
        this.$validator.errors.removeById('signUpError');

        if (!msg) return;

        this.$validator.errors.add({
          id: 'signUpError',
          field: 'email',
          msg,
        });
      },
      immediate: true,
    },

    email() {
      this.$emit('update:error', '');
    },

    password() {
      this.$emit('update:error', '');
    },

    confirmPassword() {
      this.$emit('update:error', '');
    },
  },

  methods: {
    onSwitch() {
      this.$emit('sign-in');
    },

    async onSubmit() {
      if (!this.isSubmitEnable) {
        return;
      }

      const { email, password } = this;

      this.$emit('submit', { email, password, isSignUp: true });
    },

    async onSocial() {
      this.$emit('social');
    },

    onOauthError() {
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
    GitAuthButton,
    FormItem,
    FormRow,
  },
};
</script>
