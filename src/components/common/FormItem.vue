<template>
  <div class="form-item">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormItem',
};
</script>

<style lang="postcss">
.form-item {
  margin-bottom: 16px;
}
</style>
