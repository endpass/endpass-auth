<template>
  <div>
    <component
      :is="currentComponent"
      :seed-key="seedKey"
      @seed="onSeed"
      @continue="onSubmit"
    />
  </div>
</template>

<script>
import formMixin from '@/mixins/form';
import { accountsStore } from '@/store';
import WalletPassword from '@/components/forms/WalletCreate/WalletPassword';
import WalletSeed from '@/components/forms/WalletCreate/WalletSeed';

export default {
  name: 'WalletCreateForm',
  accountsStore,

  data: () => ({
    seedKey: '',
    currentComponent: WalletPassword,
  }),

  methods: {
    onSeed(seedKey) {
      this.seedKey = seedKey;
      this.currentComponent = WalletSeed;
    },

    onSubmit() {
      this.$emit('submit');
    },
  },

  mixins: [formMixin],

  components: {
    WalletSeed,
    WalletPassword,
  },
};
</script>
