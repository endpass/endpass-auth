<template>
  <div
    :class="$attrs.class"
    class="form-row"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FormRow',
};
</script>

<style lang="postcss">
.form-row {
  display: flex;
  align-items: center;
}

.form-row[centered] {
  justify-content: center;
  text-align: center;
}
.form-row[bold] {
  font-weight: bold;
}
</style>
