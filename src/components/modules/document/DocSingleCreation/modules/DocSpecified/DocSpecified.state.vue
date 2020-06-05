<template>
  <div>
    <slot
      :status="status"
      :documentId="documentId"
      :selectedDocumentType="selectedDocumentType"
      :updateState="updateState"
    />
  </div>
</template>

<script>
export default {
  name: 'DocSpecifiedState',

  data: () => ({
    status: '',
    documentId: '',
    selectedDocumentType: '',
  }),

  methods: {
    updateState(payload) {
      if (!payload) return;
      Object.keys(payload).forEach(propName => {
        this[propName] = payload[propName];
      });
    },
  },
};
</script>
