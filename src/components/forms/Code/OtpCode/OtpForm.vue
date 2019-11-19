<template>
  <form @submit.prevent="onSubmit">
    <v-title>
      {{ $t('components.otp.title') }}
    </v-title>
    <v-description>
      {{ $t('components.otp.description') }}
    </v-description>

    <form-item>
      <v-code-input
        v-model="code"
        v-validate="'required|digits:6'"
        class="v-text-center"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code') || error"
        name="code"
        :placeholder="$t('components.otp.enterReceivedCode')"
        data-test="code-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <v-button
        :disabled="!isFormValid || isLoading"
        :is-loading="isLoading"
        type="submit"
        data-test="submit-button"
      >
        {{ $t('global.confirm') }}
      </v-button>
    </form-item>
    <form-row class="v-fs-14 v-text-center">
      <v-link
        :disabled="isLoading"
        href="#"
        data-test="recovery-link"
        @click.prevent="onRecover"
      >
        {{ $t('components.otp.noCode') }}
      </v-link>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VCodeInput from '@endpass/ui/kit/VCodeInput';
import VLink from '@endpass/ui/kit/VLink';
import { authStore } from '@/store';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'OtpForm',

  authStore,

  props: {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isSignUp: {
      type: Boolean,
      required: true,
    },

    submitHandler: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    code: '',
    error: null,
    isLoading: false,
  }),

  methods: {
    async onSubmit() {
      if (this.isLoading) return;
      try {
        const { code, email, password, isSignUp } = this;
        this.isLoading = true;
        this.error = null;

        await this.submitHandler({
          isSignUp,
          email,
          password,
          code,
        });

        this.$emit('submit', code);
      } catch (err) {
        this.error = this.$i18n.t('components.otpBlock.authFailed');
      } finally {
        this.isLoading = false;
      }
    },

    onRecover() {
      if (this.isLoading) return;

      this.$emit('recover');
    },
  },

  mixins: [formMixin],

  components: {
    VTitle,
    VDescription,
    VLink,
    VButton,
    VCodeInput,
    FormItem,
    FormRow,
  },
};
</script>

<style lang="postcss"></style>
