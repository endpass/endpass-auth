<template>
  <form
    data-test="recover-form"
    @submit.prevent="onSubmit"
  >
    <v-title>
      <span v-html="$t('components.recover.enterSeed')" />
    </v-title>
    <form-item class="v-mb-24">
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
        :is-loading="isLoading"
        data-test="submit-button"
      >
        {{ $t('global.confirm') }}
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
    isLoading: false,
  }),

  computed: {
    isSeedPhraseValid() {
      return this.seedPhrase.length >= 12;
    },
  },

  methods: {
    async onSubmit() {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$options.authStore.disableOtp({
          seedPhrase: this.seedPhrase,
        });
        this.$emit('submit');
      } catch (err) {
        console.error(err);

        const msg =
          (err && err.message) ||
          this.$i18n.t('components.otpBlock.recoverFailed');
        this.error = msg;
      } finally {
        this.isLoading = false;
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
