<template>
  <form @submit.prevent="onSubmit">
    <v-title>
      <span v-html="$t('components.createPassword.title')" />
    </v-title>
    <v-description>
      <span v-html="$t('components.createPassword.description')" />
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
    <form-item class="v-mb-24">
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
    <form-row>
      <form-controls>
        <v-button
          :disabled="!isSubmitEnable || isLoading"
          type="submit"
          size="big"
          data-test="submit-button"
        >
          {{ primaryButtonLabel }}
        </v-button>
      </form-controls>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import FormItem from '@/components/common/FormItem';
import formMixin from '@/mixins/form';
import { authStore } from '@/store';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';
import FormControls from '@/components/common/FormControls';
import FormRow from '@/components/common/FormRow';

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
    isLoading: false,
  }),

  computed: {
    isSubmitEnable() {
      return this.isFormValid && this.isPasswordEqual;
    },

    isPasswordEqual() {
      return this.password && this.password === this.repeatPassword;
    },

    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('global.confirm')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    async onSubmit() {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        this.$validator.errors.removeById('passwordId');
        await this.$options.authStore.sendCode({
          email: this.email,
        });
        this.$emit('submit', this.password);
      } catch (error) {
        this.$validator.errors.add({
          field: 'password',
          msg: this.$i18n.t('components.createPassword.createError'),
          id: 'passwordId',
        });
      } finally {
        this.isLoading = false;
      }
    },
  },

  mixins: [formMixin],

  components: {
    FormRow,
    FormControls,
    VTitle,
    VDescription,
    VInput,
    VButton,
    FormItem,
  },
};
</script>

<style lang="postcss"></style>
