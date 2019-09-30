<template>
  <form
    data-test="recover-form"
    @submit.prevent="onSubmit"
  >
    <v-title
      data-test="form-title"
      :html="$t('components.recover.enterSeed')"
    />
    <form-item is-last>
      <v-input
        v-model="seedPhrase"
        :error="error"
        label="Seed phrase"
        name="seedPhrase"
        :placeholder="$t('components.recover.seedPhrase')"
        required
        data-test="seed-phrase"
      />
    </form-item>
    <form-row>
      <v-button
        type="submit"
        :disabled="!isSeedPhraseValid || isLoading"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import { authStore, coreStore } from '@/store';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'RecoverForm',

  authStore,
  coreStore,

  data: () => ({
    error: null,
    seedPhrase: '',
  }),

  computed: {
    isLoading() {
      return this.$options.coreStore.loading;
    },

    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('global.confirm')
        : this.$i18n.t('global.loading');
    },

    isSeedPhraseValid() {
      return this.seedPhrase.length >= 12;
    },
  },

  methods: {
    async onSubmit(seedPhrase) {
      try {
        await this.$options.authStore.disableOtp({ seedPhrase });
        this.$emit('recover');
      } catch (err) {
        console.error(err);

        const msg =
          (err && err.message) ||
          this.$i18n.t('components.otpBlock.recoverFailed');
        this.error = msg;
      }
    },
  },

  components: {
    VTitle,
    VButton,
    VInput,
    FormItem,
    FormRow,
  },
};
</script>
