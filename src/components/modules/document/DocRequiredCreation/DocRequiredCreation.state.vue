<template>
  <div>
    <slot
      :selectedDocumentType="selectedDocumentType"
      :setDocumentType="setDocumentType"
    />
  </div>
</template>

<script>
export default {
  name: 'DocSpecifiedContainer',

  data: () => ({
    selectedDocumentType: '',
  }),

  methods: {
    setDocumentType(val) {
      this.selectedDocumentType = val;
    },
  },
};
</script>
