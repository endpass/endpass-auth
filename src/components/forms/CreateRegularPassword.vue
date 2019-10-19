<template>
  <form @submit.prevent="onSubmit">
    <v-title>
      {{ $t('components.createPassword.title') }}
    </v-title>
    <v-description>
      {{ $t('components.createPassword.description') }}
    </v-description>

    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        type="password"
        required
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password')"
        name="password"
        :placeholder="$t('components.createPassword.newPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-item>
      <v-input
        v-model="repeatPassword"
        v-validate="'required|min:8'"
        type="password"
        required
        data-vv-as="password"
        data-vv-name="repeatPassword"
        :error="errors.first('repeatPassword')"
        name="repeatPassword"
        :placeholder="$t('components.createPassword.repeatPassword')"
        data-test="repeat-password-input"
      />
    </form-item>
    <form-item class="v-mb-16">
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code')"
        name="code"
        :label="labelCode"
        :placeholder="$t('components.createPassword.placeholderCode')"
        data-test="code-input"
      />
    </form-item>
    <form-row class="v-mb-24">
      <form-controls>
        <v-button
          :disabled="!isSubmitEnable || isLoading"
          :is-loading="isLoading"
          type="submit"
          data-test="submit-button"
        >
          {{ $t('global.confirm') }}
        </v-button>
      </form-controls>
    </form-row>
    <form-row class="v-fs-14 v-text-center">
      <send-code
        :is-loading="isLoading"
        @click="sendCode"
      />
    </form-row>
  </form>
</template>

<script>
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import FormItem from '@/components/common/FormItem';
import formMixin from '@/mixins/form';
import { authStore } from '@/store';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';
import FormControls from '@/components/common/FormControls';
import FormRow from '@/components/common/FormRow';
import SendCode from '@/components/common/SendCode';

export default {
  name: 'CreateRegularPasswordForm',

  authStore,

  props: {
    email: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    isLoading: false,
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

    labelCode() {
      return this.email
        ? this.$i18n.t('components.createPassword.labelCodeEmail', {
            email: this.email,
          })
        : this.$i18n.t('components.createPassword.labelCode');
    },
  },

  methods: {
    async onSubmit() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.$validator.errors.removeById('sendCodeId');
        await this.$options.authStore.confirmResetRegularPassword({
          password: this.password,
          code: this.code,
        });
        this.$emit('submit', this.password);
      } catch (error) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.createPassword.confirmError'),
          id: 'sendCodeId',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async sendCode() {
      try {
        this.isLoading = true;
        this.$validator.errors.removeById('sendCodeId');
        await this.$options.authStore.resetRegularPassword({
          email: this.email,
        });
      } catch (e) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.createPassword.sendError'),
          id: 'sendCodeId',
        });
      } finally {
        this.isLoading = false;
      }
    },
  },

  async mounted() {
    await this.sendCode();
  },

  mixins: [formMixin],

  components: {
    SendCode,
    VButton,
    FormRow,
    FormControls,
    VTitle,
    VDescription,
    VInput,
    FormItem,
  },
};
</script>

<style lang="postcss"></style>
