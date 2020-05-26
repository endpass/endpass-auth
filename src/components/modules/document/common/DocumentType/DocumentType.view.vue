<template>
  <div
    class="document-types-item"
    @click="onSelect"
  >
    <div class="document-type-index">
      <v-svg-icon
        :name="icon"
        height="28px"
        width="28px"
      />
    </div>
    <div class="document-type-details">
      <div class="document-type-label">
        {{ $options.DOC_TYPES_TRANSLATES[documentType] }}
      </div>
      <div
        class="document-type-status"
        :class="{
          'is-verified': isVerified,
          'is-pending-review': isPendingReview,
        }"
      >
        {{ statusLabel }}
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
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import {
  DOC_STATUSES_TRANSLATES,
  DOC_TYPES_TRANSLATES,
} from '@/constants/translates';
import { DOC_STATUSES, DOC_TYPES } from '@/constants';

const DOC_TYPE_TO_ICON = {
  [DOC_TYPES.PASSPORT]: 'doc-type-passport',
  [DOC_TYPES.DRIVER_LICENSE]: 'doc-type-id',
  [DOC_TYPES.ID_CARD]: 'doc-type-id',
  [DOC_TYPES.PROOF_OF_ADDRESS]: 'doc-type-address',
};

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

    selectable: {
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
    icon() {
      return DOC_TYPE_TO_ICON[this.documentType];
    },

    isVerified() {
      return this.documentType === DOC_STATUSES.VERIFIED;
    },

    isPendingReview() {
      return this.documentType === DOC_STATUSES.PENDING_REVIEW;
    },

    statusLabel() {
      if (!this.isStatusShow) {
        return '';
      }

      if (!DOC_STATUSES[this.documentStatus]) {
        return this.$i18n.t('components.uploadDocument.notAdded');
      }
      return DOC_STATUSES_TRANSLATES[this.documentStatus];
    },
  },

  methods: {
    onSelect() {
      this.$emit('select', this.documentType);
    },
  },

  components: {
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
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.document-type-label {
  font-size: 16px;
  color: var(--endpass-ui-color-grey-8);
}
.document-type-status {
  font-size: 12px;
  color: var(--endpass-ui-color-grey-5);
  margin-top: 4px;
}
.document-type-status.is-verified {
  color: var(--endpass-ui-color-green-1);
}
.document-type-status.is-pending-review {
  color: var(--endpass-ui-color-yellow-1);
}
.document-type-arrow {
  display: flex;
  align-items: center;
  margin-left: auto;
  color: var(--endpass-ui-color-grey-5);
}
</style>
