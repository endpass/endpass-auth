<template>
  <button
    :class="{ 'option-button': true, big: big }"
    type="button"
    @click="emitClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'OptionButton',

  props: {
    big: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    emitClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lane="postcss">
.option-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14.5px 20px;
  margin: 0;
  border: none;
  border-bottom: 1px solid #f2f4f7;
  background: none;
  font-size: 12px;
  color: #13171a;
  cursor: pointer;
  transition: background-color 0.25s;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;

  &.big {
    padding: 26px 20px;
    font-size: 16px;
  }

  &:hover {
    background-color: #f2f4f7;
  }

  &:focused,
  &.active {
    background-color: #f2f4f7;
  }
}
</style>
