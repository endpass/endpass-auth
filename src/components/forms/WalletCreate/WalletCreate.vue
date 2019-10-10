<template>
  <div>
    <component
      :is="currentComponent"
      :seed-key="seedKey"
      :create-handler="createHandler"
      @create="onCreate"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import WalletPassword from '@/components/forms/WalletCreate/WalletPassword';
import WalletSeed from '@/components/forms/WalletCreate/WalletSeed';

export default {
  name: 'WalletCreateForm',

  props: {
    createHandler: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    currentComponent: 'wallet-password',
    seedKey: '',
    walletData: {},
  }),

  methods: {
    onCreate(walletData) {
      const { seedKey } = walletData;
      this.walletData = walletData;
      this.seedKey = seedKey;
      this.currentComponent = 'wallet-seed';
    },

    onSubmit() {
      this.$emit('submit', this.walletData);
    },
  },

  components: {
    WalletSeed,
    WalletPassword,
  },
};
</script>
