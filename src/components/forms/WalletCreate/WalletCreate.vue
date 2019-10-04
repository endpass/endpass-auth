<template>
  <div>
    <component
      :is="currentComponent"
      :seed-key="seedKey"
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

  data: () => ({
    seedKey: '',
    currentComponent: 'wallet-password',
  }),

  methods: {
    onCreate(seedKey) {
      this.seedKey = seedKey;
      this.currentComponent = 'wallet-seed';
    },

    onSubmit() {
      this.$emit('submit');
    },
  },

  components: {
    WalletSeed,
    WalletPassword,
  },
};
</script>
