<template>
  <input
    :class="{ 'widget-input': true, 'is-error': isError }"
    :value="value"
    @input="handleInput"
  />
</template>

<script>
export default {
  name: 'WidgetInput',

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  computed: {
    isError() {
      return !!this.$attrs.error;
    },
  },

  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="postcss">
.widget-input {
  display: block;
  width: 100%;
  border: none;
  border-bottom: 1px solid #f2f4f7;
  padding: 26px 20px;
  font-size: 16px;
  transition: background 0.25s;

  &.is-error {
    background: #ffccd1;
  }
}
</style>
