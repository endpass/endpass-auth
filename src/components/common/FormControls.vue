<template>
  <section class="form-controls">
    <slot />
  </section>
</template>

<script>
export default {
  name: 'FormControls',
};
</script>

<style lang="postcss">
.form-controls {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 24px;

  & > * {
    margin-right: 16px;
    margin-bottom: 0 !important;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
