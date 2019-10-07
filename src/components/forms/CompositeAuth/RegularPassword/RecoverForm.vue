<template>
  <form @submit.prevent="onSubmit">
    <v-title>
      <span v-html="$t('components.regularPasswordRecover.title')" />
    </v-title>
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
        :placeholder="$t('components.regularPasswordRecover.newPassword')"
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
        :error="errors.first('code')"
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
          :is-loading="isLoading"
          type="submit"
          data-test="submit-button"
        >
          {{ $t('global.confirm') }}
        </v-button>
      </form-controls>
    </form-item>
    <form-row class="v-fs-14 v-text-center">
      {{ $t('components.regularPasswordRecover.didntGetCode') }}&nbsp;
      <v-link
        :disabled="isLoading"
        href="#"
        data-test="send-code"
        @click.prevent="sendCode"
      >
        {{ $t('components.regularPasswordRecover.sendTitle') }}
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
import { authStore } from '@/store';
import VTitle from '@/components/common/VTitle';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'PasswordForm',

  authStore,

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    password: '',
    repeatPassword: '',
    code: '',
    isLoading: false,
  }),

  computed: {
    isSubmitEnable() {
      return this.isFormValid && this.isPasswordEqual;
    },

    isPasswordEqual() {
      return this.password && this.password === this.repeatPassword;
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
          msg: this.$i18n.t('components.regularPasswordRecover.recoveryError'),
          id: 'sendCodeId',
        });
      } finally {
        this.isLoading = false;
      }
    },

    closeForm() {
      this.$emit('close');
    },

    async sendCode() {
      if (this.isLoading) return;
      try {
        this.$validator.errors.removeById('sendCodeId');
        this.isLoading = true;
        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.regularPasswordRecover.sendError'),
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
