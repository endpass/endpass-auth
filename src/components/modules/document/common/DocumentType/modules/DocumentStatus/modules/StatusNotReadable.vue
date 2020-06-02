<template>
  <div class="document-status-not-readable">
    <status
      :status="status"
      class="document-status-not-readable-status"
    />
    <v-svg-icon
      class="document-status-not-readable-icon"
      name="circle-warning"
      height="14px"
      width="14px"
    />
    {{ $t('components.uploadDocument.pleaseReupload') }}
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import Status from './Status';

export default {
  name: 'StatusVerifiedView',

  props: {
    status: {
      type: String,
      required: true,
    },
  },

  components: {
    Status,
    VSvgIcon,
  },
};
</script>

<style lang="postcss">
.document-status-not-readable {
  font-size: 14px;
  color: var(--endpass-ui-color-red-2);
  display: flex;
  align-items: center;
}
.document-status-not-readable-status {
  margin-right: 5px;
}
.document-status-not-readable-icon {
  margin-right: 5px;
}
</style>
