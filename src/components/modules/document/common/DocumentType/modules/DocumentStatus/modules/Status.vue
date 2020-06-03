<template>
  <div
    class="document-status"
    :class="statusCssClass"
  >
    {{ status | documentStatus }}
    <slot />
  </div>
</template>

<script>
import { DOC_STATUSES } from '@/constants';

const CSS_CLASSES_BY_STATUSES = {
  [DOC_STATUSES.DRAFT]: 'status-draft',
  [DOC_STATUSES.NOT_READABLE]: 'status-not-readable',
  [DOC_STATUSES.NOT_VERIFIED]: 'status-not-verified',
  [DOC_STATUSES.RECOGNITION]: 'status-recognition',
  [DOC_STATUSES.PENDING_REVIEW]: 'status-review',
  [DOC_STATUSES.VERIFIED]: 'status-verified',
};

export default {
  name: 'StatusView',

  props: {
    status: {
      type: String,
      required: true,
    },
  },

  computed: {
    statusCssClass() {
      return CSS_CLASSES_BY_STATUSES[this.status];
    },
  },
};
</script>

<style lang="postcss">
:root {
  --endpass-ui-color-orange-2: #ff7500;
}
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
  vertical-align: middle;
}

.document-status.status-recognition,
.document-status.status-review {
  /* TODO: add to ui-kit */
  color: var(--endpass-ui-color-orange-2);
  background-color: rgba(253, 209, 58, 0.15);
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
