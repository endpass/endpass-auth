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
  name: 'DocSpecifiedInteractor',

  inject: ['gateway'],

  methods: {
    async onCreate({ documentId }) {
      await this.gateway.finishCreate({ documentId });
    },

    async onCancel() {
      await this.gateway.cancelCreate();
    },
  },
};
</script>
