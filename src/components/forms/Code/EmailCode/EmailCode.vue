<template>
  <form @submit.prevent="onSubmit">
    <v-title>
      <span v-html="$t('components.emailCode.title')" />
    </v-title>
    <v-description>
      <span v-html="$t('components.emailCode.description', { email })" />
    </v-description>
    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code') || error"
        name="code"
        :placeholder="$t('components.emailCode.placeholder')"
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
      <send-code
        :is-loading="isLoading"
        @send="sendCode"
      />
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import { authStore } from '@/store';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';
import SendCode from '@/components/common/SendCode';

export default {
  name: 'EmailCode',

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
        this.isLoading = true;
        this.error = null;
        const { code, email, password, isSignUp } = this;

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

    async sendCode() {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        this.error = null;
        this.$validator.errors.removeById('sendCodeId');
        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.emailCode.sendError'),
          id: 'sendCodeId',
        });
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.sendCode();
  },

  mixins: [formMixin],

  components: {
    SendCode,
    VTitle,
    VDescription,
    VButton,
    VInput,
    FormItem,
    FormRow,
  },
};
</script>

<style lang="postcss"></style>
