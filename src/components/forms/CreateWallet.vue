<template>
  <div>
    <div v-if="!isShowSeed">
      <form
        data-test="define-pwd-form"
        @submit.prevent="onCreateWallet"
      >
        <message
          class="v-modal-card-title"
          v-html="$t('components.createWallet.choosePass')"
        />
        <form-item>
          <v-input
            v-model="password"
            v-validate="'required|min:8'"
            data-vv-as="password"
            data-vv-name="password"
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
            :error="errors.first('passwordConfirm')"
            required
            type="password"
            :placeholder="$t('components.createWallet.confirmPass')"
          />
        </form-item>
        <message
          v-if="error"
          :error="true"
          data-test="create-wallet-error"
        >
          {{ error }}
        </message>
        <div>
          <v-spacer :height="10" />
          <v-button
            :disabled="!canSubmit"
            size="big"
            type="submit"
            data-test="submit-button"
          >
            {{ primaryButtonLabel }}
          </v-button>
        </div>
      </form>
    </div>
    <div v-else>
      <form-item>
        <div class="box">
          <p>{{ $t('components.createWallet.recoveryPhrase') }}</p>
          <br>
          <p
            class="code"
            data-test="seed-phrase"
          >
            {{ seedKey }}
          </p>
        </div>
      </form-item>
      <v-button
        type="button"
        size="big"
        @click="onContinue"
      >
        {{ $t('global.continue') }}
      </v-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message';
import FormItem from '@/components/common/FormItem';
import VSpacer from '@/components/common/VSpacer';
import VInput from '@endpass/ui/kit/VInput';
import formMixin from '@/mixins/form';

export default {
  name: 'CreateWalletForm',

  data: () => ({
    email: '',
    error: '',
    passwordConfirm: '',
    password: '',
    seedKey: null,
    isShowSeed: false,
    isLoading: false,
  }),

  computed: {
    canSubmit() {
      return this.isPasswordEqual && !this.isLoading && this.isFormValid;
    },
    isPasswordEqual() {
      return this.password && this.password === this.passwordConfirm;
    },
    primaryButtonLabel() {
      return this.isLoading
        ? this.$i18n.t('global.loading')
        : this.$i18n.t('components.createWallet.createWallet');
    },
  },

  methods: {
    ...mapActions(['createWallet', 'setWalletCreated']),
    async onCreateWallet() {
      if (!this.canSubmit) {
        return;
      }

      this.isLoading = true;
      try {
        this.error = '';
        this.seedKey = await this.createWallet({ password: this.password });
        this.isShowSeed = true;
      } catch (e) {
        console.error(e);
        this.error = this.$i18n.t('components.createWallet.error');
      }
      this.isLoading = false;
    },
    onContinue() {
      this.setWalletCreated();
    },
  },

  mixins: [formMixin],

  components: {
    FormItem,
    VInput,
    VSpacer,
    VButton,
    Message,
  },
};
</script>
