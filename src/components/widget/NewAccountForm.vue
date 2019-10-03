<template>
  <form @submit.prevent="handleSubmit">
    <widget-input
      v-model="password"
      v-validate="'required|min:8'"
      :error="errors.first('password')"
      :disabled="isLoading"
      :placeholder="$t('components.passwordForm.enterPassword')"
      data-test="new-account-password-input"
      type="password"
      name="password"
    />
    <option-button
      :is-big="true"
      type="submit"
      data-test="new-account-submit-button"
      :disabled="!isFormValid || isLoading"
    >
      {{ submitButtonLabel }}
    </option-button>
    <option-button
      :is-big="true"
      :disabled="isLoading"
      data-test="new-account-cancel-button"
      @click="handleCancelClick"
    >
      {{ $t('components.widgetNewAccount.cancel') }}
    </option-button>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
import formMixin from '@/mixins/form';
import WidgetInput from './WidgetInput';
import OptionButton from './OptionButton';

export default {
  name: 'WidgetNewAccountForm',

  props: {
    currentAccount: {
      type: String,
      default: null,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    password: '',
  }),

  computed: {
    submitButtonLabel() {
      if (this.isLoading) {
        return this.$t('components.widgetNewAccount.creatingAccount');
      }

      return this.$t('components.widgetNewAccount.createAccount');
    },
  },

  watch: {
    password() {
      const { errors } = this;

      if (errors.firstById('incorrectPassword')) {
        errors.removeById('incorrectPassword');
      }
    },
  },

  methods: {
    ...mapActions(['createAccountFromWidget']),

    async handleSubmit() {
      if (!this.isFormValid) return;

      try {
        await this.createAccountFromWidget({
          address: this.currentAccount,
          password: this.password,
        });
        this.$emit('cancel');
      } catch (err) {
        this.errors.add({
          id: 'incorrectPassword',
          field: 'password',
          msg: err.message,
        });
      }
    },

    handleCancelClick() {
      this.$emit('cancel');
    },
  },

  mixins: [formMixin],

  components: {
    WidgetInput,
    OptionButton,
  },
};
</script>
