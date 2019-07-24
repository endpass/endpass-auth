<template>
  <form @submit.prevent="handleSubmit">
    <widget-input
      v-model="password"
      v-validate="'required|min:8'"
      :error="errors.first('password')"
      :disabled="isLoading"
      type="password"
      name="password"
      :placeholder="$t('components.passwordForm.enterWalletPassword')"
    />
    <option-button
      :is-big="true"
      type="submit"
      :disabled="!isFormValid || isLoading"
    >
      {{ submitButtonLabel }}
    </option-button>
    <option-button
      :is-big="true"
      :disabled="isLoading"
      @click="handleCancelClick"
    >
      {{ $t('components.widgetNewAccount.cancel') }}
    </option-button>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
import formMixin from '@/mixins/form';
import WidgetInput from './WidgetInput.vue';
import OptionButton from './OptionButton.vue';

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
    ...mapActions(['createWalletFromWidget']),

    async handleSubmit() {
      if (!this.isFormValid) return;

      try {
        await this.createWalletFromWidget({
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
