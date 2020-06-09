<template>
  <div>
    <span
      v-if="date"
      class="document-status-verified-expire-date"
    >
      {{ date | formatUnixDate('MMM DD, YYYY') }}
    </span>
    <status :status="status" />
  </div>
</template>

<script>
import Status from './Status';

export default {
  name: 'StatusVerifiedView',

  props: {
    status: {
      type: String,
      required: true,
    },

    date: {
      type: Number,
      default: null,
    },
  },

  components: {
    Status,
  },
};
</script>

<style lang="postcss">
.document-status-verified-expire-date {
  font-size: 14px;
  color: var(--endpass-ui-color-grey-6);
  margin-right: 5px;
}
</style>
