<template>
  <div
    class="document-types-item"
    @click="onSelect"
  >
    <div class="document-type-index">
      <v-svg-icon
        :name="docTypeIcon"
        height="28px"
        width="28px"
      />
    </div>
    <div class="document-type-details">
      <div class="document-type-label">
        {{ typeTitle }}
      </div>
      <div class="document-type-description">
        <document-status
          v-if="isDocumentHaveStatus"
          :status="documentStatus"
        />
        <span
          v-else
          class="document-not-added"
        >
          {{ $t('components.uploadDocument.notAdded') }}
        </span>
      </div>
    </div>
    <div
      class="document-type-action-icon"
      :class="{
        'is-selected': isSelected,
      }"
    >
      <v-svg-icon
        width="21px"
        height="21px"
        :name="actionIcon"
      />
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import { DOC_TYPES_TRANSLATES } from '@/constants/translates';
import { DOC_TYPE_TO_ICON, DOC_STATUS_VALUES } from './DocumentType.constants';
import DocumentStatus from '../DocumentStatus';

export default {
  name: 'DocumentTypeView',

  DOC_TYPES_TRANSLATES,

  props: {
    documentStatus: {
      type: String,
      default: '',
    },

    documentType: {
      type: String,
      required: true,
    },

    isSelectable: {
      type: Boolean,
      default: false,
    },

    isStatusShow: {
      type: Boolean,
      default: false,
    },

    isSelected: {
      type: Boolean,
      default: false,
    },

    documentExpireAt: {
      // TODO: change to correct type date
      type: String,
      default: '',
    },
  },

  computed: {
    docTypeIcon() {
      return DOC_TYPE_TO_ICON[this.documentType];
    },

    actionIcon() {
      if (!this.isSelectable) return 'chevron-right';

      return this.isSelected ? 'check-alt' : 'circle-mark';
    },

    isDocumentHaveStatus() {
      return DOC_STATUS_VALUES.includes(this.documentStatus);
    },

    typeTitle() {
      return DOC_TYPES_TRANSLATES[this.documentType];
    },
  },

  methods: {
    onSelect() {
      this.$emit('select', this.documentType);
    },
  },

  components: {
    DocumentStatus,
    VSvgIcon,
  },
};
</script>

<style lang="postcss">
.document-types-item {
  display: flex;
  padding: 16px 0;
  box-shadow: inset 0 -1px 0 var(--endpass-ui-color-grey-1);
  cursor: pointer;
}
.document-types-item:last-of-type {
  box-shadow: none;
}
.document-type-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--endpass-ui-color-primary-7);
  border-radius: 50%;
}
.document-type-details {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.document-type-label {
  font-size: 16px;
  color: var(--endpass-ui-color-grey-8);
}
.document-type-description {
  margin-top: 4px;
}
.document-not-added {
  font-size: 14px;
  padding: 4px 0;
  display: inline-block;
  color: var(--endpass-ui-color-grey-5);
}
.document-type-action-icon {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: var(--endpass-ui-color-grey-5);
}

.document-type-action-icon.is-selected {
  color: var(--endpass-ui-color-green-2);
}
</style>
