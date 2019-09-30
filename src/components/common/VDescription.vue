<template>
  <div
    class="v-description v-modal-card-description"
    v-html="html"
  />
</template>

<script>
export default {
  name: 'VDescription',
  props: {
    html: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="postcss">
.v-description {
  line-height: 20px;
}
</style>
