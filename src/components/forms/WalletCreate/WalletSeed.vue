<template>
  <div>
    <v-title>
      <span v-html="$t('components.createWallet.recoveryTitle')" />
    </v-title>
    <v-description>
      <span v-html="$t('components.createWallet.recoverySubtitle')" />
    </v-description>
    <form-item>
      <div>
        <ul
          class="wallet-create-seed"
          data-test="seed-phrase"
        >
          <li
            v-for="word in splittedSeedKey"
            :key="word"
          >
            <v-tag skin="light-gray">
              {{ word }}
            </v-tag>
          </li>
        </ul>
        <div
          v-if="seedTemplateUrl"
          class="wallet-create-template-download v-text-center v-mb-24"
        >
          <v-icon-control
            icon="pdf"
            :href="seedTemplateUrl"
            target="_blank"
          >
            {{ $t('components.createWallet.downloadTemplate') }}
          </v-icon-control>
        </div>
      </div>
      <div class="v-mb-24">
        <v-checkbox
          v-model="isSeedConfirmed"
          data-test="wallet-seed-confirm"
        >
          {{ $t('components.createWallet.seedConfirmation') }}
        </v-checkbox>
      </div>
    </form-item>
    <v-button
      :disabled="!isSeedConfirmed"
      type="button"
      size="big"
      data-test="continue-button"
      @click="onSubmit"
    >
      {{ $t('global.continue') }}
    </v-button>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VTag from '@endpass/ui/kit/VTag';
import VIconControl from '@endpass/ui/kit/VIconControl';
import VCheckbox from '@endpass/ui/kit/VCheckbox';
import FormItem from '@/components/common/FormItem';
import { accountsStore } from '@/store';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'WalletSeed',

  accountsStore,

  props: {
    seedKey: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    seedTemplateUrl: null,
    isSeedConfirmed: false,
  }),

  computed: {
    splittedSeedKey() {
      if (!this.seedKey) return [];

      return this.seedKey.split(/\s/);
    },
  },

  methods: {
    onSubmit() {
      if (!this.isSeedConfirmed) return;

      this.$emit('submit');
    },
  },

  async mounted() {
    this.seedTemplateUrl = await this.$options.accountsStore.getSeedTemplateUrl();
  },

  components: {
    VTitle,
    VDescription,
    FormItem,
    VButton,
    VTag,
    VIconControl,
    VCheckbox,
  },
};
</script>
<style lang="postcss">
.wallet-create-seed {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  text-align: center;
  list-style: none;
  margin: 0 -4px 16px;
}

.wallet-create-seed li {
  margin: 4px;
}

.wallet-create-template-download a {
  display: inline-flex !important;
}

.wallet-create-template-download svg {
  color: var(--endpass-ui-color-grey-2);
}
</style>
