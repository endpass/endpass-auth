<template>
  <div>
    <slot
      :onCancel="onCancel"
      :onFinish="onFinish"
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

    async onFinish() {
      await this.gateway.finishCreate();
    },
  },

  async beforeMount() {
    await this.gateway.clearSelectedDocuments();

    // should not be called with await, because infinite loop
    this.gateway.subscribeToUpdateStatus();
  },

  beforeDestroy() {
    this.gateway.unsubscribeFromUpdateStatus();
  },
};
</script>
