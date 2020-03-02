<template>
  <div class="document-types">
    <div
      v-for="(status, index) in statuses"
      :key="status.type"
      @click="onSelect(status.type)"
    >
      <div class="document-type-index">
        {{ index + 1 }}
      </div>
      <div class="document-type-label">
        {{ DOC_TYPES_TRANSLATES[status.type] }}
      </div>
      <div class="document-type-status">
        {{ DOC_STATUSES_TRANSLATES[status.status] }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  DOC_STATUSES_TRANSLATES,
  DOC_TYPES_TRANSLATES,
} from '@/constants/translates';

export default {
  name: 'DocumentTypesView',

  DOC_STATUSES_TRANSLATES,
  DOC_TYPES_TRANSLATES,

  props: {
    statuses: {
      type: Array,
      required: true,
    },
  },

  methods: {
    onSelect(documentType) {
      this.$emit('select', documentType);
    },
  },
};
</script>
<style lang="postcss">
.document-types {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
</style>
