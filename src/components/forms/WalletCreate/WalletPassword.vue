<template>
  <div>
    <form
      data-test="define-pwd-form"
      @submit.prevent="onCreateWallet"
    >
      <v-title>
        {{ $t('components.createWallet.passwordCreate') }}
      </v-title>
      <v-description>
        <span v-html="$t('components.createWallet.passwordDescription')" />
      </v-description>
      <form-item>
        <v-input
          v-model="password"
          v-validate="'required|min:8'"
          data-vv-as="password"
          data-vv-name="password"
          data-test="password-main"
          :error="errors.first('password')"
          required
          type="password"
          :placeholder="$t('components.createWallet.enterPass')"
        />
      </form-item>
      <form-item>
        <v-input
          v-model="passwordConfirm"
          v-validate="'required|min:8'"
          label=""
          data-vv-as="password confirm"
          data-vv-name="passwordConfirm"
          data-test="password-confirm"
          :error="errors.first('passwordConfirm')"
          required
          type="password"
          :placeholder="$t('components.createWallet.confirmPass')"
        />
      </form-item>
      <message
        v-if="error"
        :error="true"
        data-test="wallet-create-error"
      >
        {{ error }}
      </message>
      <div>
        <v-spacer :height="10" />
        <v-button
          :disabled="!isSubmitAvailable"
          :is-loading="isLoading"
          size="big"
          type="submit"
          data-test="submit-button-wallet-create"
        >
          {{ $t('components.createWallet.createWallet') }}
        </v-button>
      </div>
    </form>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import VSpacer from '@/components/common/VSpacer';
import FormItem from '@/components/common/FormItem';
import Message from '@/components/common/Message';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'WalletPassword',

  props: {
    createHandler: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    error: '',
    passwordConfirm: '',
    password: '',
    isLoading: false,
  }),

  computed: {
    isSubmitAvailable() {
      return this.isPasswordEqual && !this.isLoading && this.isFormValid;
    },

    isPasswordEqual() {
      return this.password && this.password === this.passwordConfirm;
    },
  },

  methods: {
    async onCreateWallet() {
      if (!this.isSubmitAvailable) {
        return;
      }

      this.isLoading = true;

      try {
        this.error = '';
        const data = await this.createHandler({
          password: this.password,
        });

        this.$emit('create', data);
      } catch (e) {
        console.error(e);
        this.error = this.$i18n.t('components.createWallet.error');
      } finally {
        this.isLoading = false;
      }
    },
  },

  mixins: [formMixin],

  components: {
    VTitle,
    VDescription,
    FormItem,
    Message,
    VInput,
    VSpacer,
    VButton,
  },
};
</script>
