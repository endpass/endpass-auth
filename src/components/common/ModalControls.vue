<template>
  <section class="modal-controls">
    <slot />
  </section>
</template>

<script>
export default {
  name: 'ModalControls',
};
</script>

<style lang="postcss">
.modal-controls {
  display: flex;
  align-items: center;
  width: 100%;
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
