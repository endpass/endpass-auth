<template>
  <div
    class="upload-title"
    :class="{ 'is-error': isError }"
  >
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'UploadTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
    isError: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="postcss">
.upload-title {
  letter-spacing: 1.1px;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
  color: var(--endpass-ui-color-primary-7);
}

.upload-title.is-error {
  color: var(--endpass-ui-color-error);
}
</style>
