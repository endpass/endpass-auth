<template>
  <div>
    <slot
      :onCancel="onCancel"
      :onCreate="onCreate"
    />
  </div>
</template>

<script>
export default {
  name: 'DocRequiredCreationInteractor',

  inject: ['gateway'],

  methods: {
    async onCancel() {
      await this.gateway.cancelCreate();
    },

    async onCreate() {
      await this.gateway.finishCreate();
    },
  },

  beforeMount() {
    this.gateway.subscribeToUpdateStatus();
  },

  beforeDestroy() {
    this.gateway.unsubscribeFromUpdateStatus();
  },
};
</script>
