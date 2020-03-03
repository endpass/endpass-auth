<template>
  <div class="document-types">
    <div
      v-for="(type, index) in types"
      :key="type"
      class="document-types-item"
      @click="onSelect(type)"
    >
      <div class="document-type-index">
        {{ index + 1 }}
      </div>
      <div class="document-type-details">
        <div class="document-type-label">
          {{ $options.DOC_TYPES_TRANSLATES[type] }}
        </div>
        <div class="document-type-status">
          {{ $options.DOC_STATUSES_TRANSLATES[typeToStatus[type]] }}
        </div>
      </div>
      <div class="document-type-arrow">
        <v-svg-icon
          width="28px"
          height="28px"
          name="chevron-right"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import {
  DOC_STATUSES_TRANSLATES,
  DOC_TYPES_TRANSLATES,
} from '@/constants/translates';

export default {
  name: 'DocumentTypesView',

  DOC_STATUSES_TRANSLATES,
  DOC_TYPES_TRANSLATES,

  props: {
    typeToStatus: {
      type: Object,
      required: true,
    },

    types: {
      type: Array,
      required: true,
    },
  },

  methods: {
    onSelect(documentType) {
      this.$emit('select', documentType);
    },
  },

  components: {
    VSvgIcon,
  },
};
</script>
<style lang="postcss">
.document-types {
}
.document-types-item {
  display: flex;
  padding: 16px 0;
  box-shadow: inset 0 -1px 0 var(--endpass-ui-color-grey-1);
  cursor: pointer;
}
.document-type-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--endpass-ui-color-grey-1);
  border-radius: 50%;
}
.document-type-details {
  margin: 0 16px;
}
.document-type-label {
  font-size: 16px;
  color: var(--endpass-ui-color-grey-8);
}
.document-type-status {
  font-size: 12px;
}
.document-type-arrow {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: var(--endpass-ui-color-grey-5);
}
</style>
