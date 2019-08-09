<template>
  <div>
    <div v-if="!isShowSeed">
      <form data-test="define-pwd-form" @submit.prevent="onCreateWallet">
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
        <message v-if="error" :error="true" data-test="create-wallet-error">
          {{ error }}
        </message>
        <div>
          <v-spacer :height="10" />
          <v-button
            :disabled="!canSubmit"
            size="big"
            type="submit"
            data-test="submit-button-create-wallet"
          >
            {{ primaryButtonLabel }}
          </v-button>
        </div>
      </form>
    </div>
    <div v-else>
      <message
        class="v-modal-card-title"
        v-html="$t('components.createWallet.recoveryTitle')"
      />
      <form-item>
        <div class="box">
          <p
            class="create-wallet-subtitle v-body is-small"
            v-html="$t('components.createWallet.recoverySubtitle')"
          />
          <ul class="create-wallet-seed" data-test="seed-phrase">
            <li v-for="word in splittedSeedKey" :key="word">
              <v-tag skin="light-gray">
                {{ word }}
              </v-tag>
            </li>
          </ul>
          <div v-if="seedTemplateUrl" class="create-wallet-template-download">
            <v-icon-control icon="pdf" :href="seedTemplateUrl" target="_blank">
              {{ $t('components.createWallet.downloadTemplate') }}
            </v-icon-control>
          </div>
        </div>
        <div class="create-wallet-seed-check">
          <v-checkbox v-model="isSeedConfirmed">
            {{ $t('components.createWallet.seedConfirmation') }}
          </v-checkbox>
        </div>
      </form-item>
      <v-button
        :disabled="!isSeedConfirmed"
        type="button"
        size="big"
        data-test="continue-button"
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
import VTag from '@endpass/ui/kit/VTag';
import VIconControl from '@endpass/ui/kit/VIconControl';
import VCheckbox from '@endpass/ui/kit/VCheckbox';
import formMixin from '@/mixins/form';

export default {
  name: 'CreateWalletForm',

  data: () => ({
    seedTemplateUrl: null,
    email: '',
    error: '',
    passwordConfirm: '',
    password: '',
    seedKey: null,
    isSeedConfirmed: false,
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

    splittedSeedKey() {
      if (!this.seedKey) return [];

      return this.seedKey.split(/\s/);
    },
  },

  methods: {
    ...mapActions([
      'createInitialWallet',
      'setWalletCreated',
      'getSeedTemplateUrl',
    ]),

    async onCreateWallet() {
      if (!this.canSubmit) {
        return;
      }

      this.isLoading = true;

      try {
        this.error = '';
        this.seedKey = await this.createInitialWallet({
          password: this.password,
        });
        this.isShowSeed = true;
      } catch (e) {
        console.error(e);
        this.error = this.$i18n.t('components.createWallet.error');
      }
      this.isLoading = false;
    },
    onContinue() {
      if (!this.isSeedConfirmed) return;

      this.setWalletCreated();
    },
  },

  async mounted() {
    this.seedTemplateUrl = await this.getSeedTemplateUrl();
  },

  mixins: [formMixin],

  components: {
    FormItem,
    Message,
    VInput,
    VSpacer,
    VButton,
    VTag,
    VIconControl,
    VCheckbox,
  },
};
</script>
<style lang="postcss">
.create-wallet-subtitle {
  color: var(--endpass-ui-color-grey-6);
  text-align: center;
  margin-bottom: 28px;
}

.create-wallet-seed {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  text-align: center;
  list-style: none;
  margin: 0 -4px 16px;
}

.create-wallet-seed li {
  margin: 4px;
}

.create-wallet-template-download {
  text-align: center;
  margin-bottom: 24px;
}

.create-wallet-template-download a {
  display: inline-flex !important;
}

.create-wallet-template-download svg {
  color: #e5e9ef;
}

.create-wallet-seed-check {
  margin-bottom: 24px;
}
</style>
