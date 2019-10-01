<template>
  <form
    class="form-otp"
    @submit.prevent="onSubmit"
  >
    <v-title>
      <span v-html="$t('components.regularPasswordRecover.title')" />
    </v-title>
    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password') || error"
        name="password"
        type="password"
        :placeholder="$t('components.regularPasswordRecover.newPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-item>
      <v-input
        v-model="repeatPassword"
        v-validate="'required|min:8'"
        data-vv-as="password"
        data-vv-name="repeatPassword"
        :error="errors.first('repeatPassword') || error"
        name="repeatPassword"
        type="password"
        :placeholder="$t('components.regularPasswordRecover.repeatPassword')"
        data-test="repeat-password-input"
      />
    </form-item>
    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code') || error"
        name="code"
        :label="$t('components.regularPasswordRecover.labelCode')"
        :placeholder="$t('components.regularPasswordRecover.placeholderCode')"
        data-test="password-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <form-controls>
        <v-button
          :disabled="isLoading"
          skin="quaternary"
          data-test="submit-button"
          @click="closeForm"
        >
          {{ $t('global.cancel') }}
        </v-button>
        <v-button
          :disabled="!isSubmitEnable || isLoading"
          type="submit"
          data-test="submit-button"
        >
          {{ primaryButtonLabel }}
        </v-button>
      </form-controls>
    </form-item>
    <form-row
      class="v-fs-14"
      centered
    >
      {{ $t('components.regularPasswordRecover.didntGetCode') }}&nbsp;
      <v-link
        :disabled="isLoading"
        href="#"
        data-test="send-code"
        @click.prevent="sendCode"
      >
        {{ $t('components.emailCode.sendTitle') }}
      </v-link>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import VLink from '@endpass/ui/kit/VLink';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import { authStore, coreStore } from '@/store';
import VTitle from '@/components/common/VTitle';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'PasswordForm',

  authStore,
  coreStore,

  props: {
    email: {
      type: String,
      required: true,
    },

    error: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    password: '',
    repeatPassword: '',
    code: '',
  }),

  computed: {
    isSubmitEnable() {
      return this.isFormValid && this.isPasswordEqual;
    },

    isPasswordEqual() {
      return this.password && this.password === this.repeatPassword;
    },

    isLoading() {
      return this.$options.coreStore.loading;
    },

    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('global.confirm')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    async onSubmit() {
      try {
        this.$validator.errors.removeById('sendCodeId');
        await this.$options.authStore.resetRegularPassword({
          password: this.password,
          code: this.code,
        });
        this.$emit('submit', this.password);
      } catch (error) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.regularPasswordRecover.recoveryError'),
          id: 'sendCodeId',
        });
      }
    },

    closeForm() {
      this.$emit('recover-success');
    },

    async sendCode() {
      try {
        this.$validator.errors.removeById('sendCodeId');
        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.emailCode.sendError'),
          id: 'sendCodeId',
        });
      }
    },
  },

  mounted() {
    this.sendCode();
  },

  mixins: [formMixin],

  components: {
    FormControls,
    VLink,
    VTitle,
    VButton,
    VInput,
    FormItem,
    FormRow,
  },
};
</script>

<style lang="postcss"></style>
