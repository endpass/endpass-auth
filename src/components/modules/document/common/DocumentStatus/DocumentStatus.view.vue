<template>
  <div
    class="document-status"
    :class="statusCssClass"
  >
    {{ label }}
    <slot />
  </div>
</template>

<script>
import { DOC_STATUSES } from '@/constants';
import { DOC_STATUSES_TRANSLATES } from '@/constants/translates';

const STATUS_TO_CSS = {
  [DOC_STATUSES.DRAFT]: 'status-draft',
  [DOC_STATUSES.NOT_READABLE]: 'status-not-readable',
  [DOC_STATUSES.NOT_VERIFIED]: 'status-not-verified',
  [DOC_STATUSES.RECOGNITION]: 'status-recognition',
  [DOC_STATUSES.PENDING_REVIEW]: 'status-review',
  [DOC_STATUSES.VERIFIED]: 'status-verified',
};

export default {
  name: 'DocumentStatusView',

  props: {
    status: {
      type: String,
      required: true,
    },
  },

  computed: {
    label() {
      return DOC_STATUSES_TRANSLATES[this.status];
    },

    statusCssClass() {
      return STATUS_TO_CSS[this.status];
    },
  },
};
</script>

<style lang="postcss">
.document-status {
  text-align: center;
  color: var(--endpass-ui-color-grey-9);
  background-color: var(--endpass-ui-color-grey-2);
  white-space: nowrap;
  font-size: 14px;
  line-height: 16px;
  font-weight: normal;
  border-radius: 2px;
  padding: 2px 4px;
  display: inline-block;
}

.document-status.status-recognition,
.document-status.status-review {
  color: var(--endpass-ui-color-yellow-1);
  background-color: rgba(253, 209, 58, 0.1);
}

.document-status.status-not-readable,
.document-status.status-not-verified {
  color: var(--endpass-ui-color-red-2);
  background-color: rgba(217, 29, 40, 0.08);
}

.document-status.status-verified {
  color: var(--endpass-ui-color-green-2);
  background-color: rgba(36, 161, 72, 0.1);
}
</style>
