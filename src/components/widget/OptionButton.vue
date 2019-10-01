<template>
  <button
    :class="{ 'option-button': true, disabled: disabled }"
    :disabled="disabled"
    type="button"
    @click="emitClick"
  >
    <slot />
    <div
      v-if="icon"
      :style="{ transform: iconTransform, color: iconFill }"
      class="option-button-icon"
    >
      <v-svg-icon
        :name="icon"
        :fill="iconFill"
        width="16px"
        height="16px"
      />
    </div>
  </button>
</template>

<script>
import VSvgIcon from '@/components/common/VSvgIcon';

export default {
  name: 'OptionButton',

  props: {
    icon: {
      type: String,
      default: null,
    },

    iconFill: {
      type: String,
      default: null,
    },

    iconTransform: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    emitClick() {
      this.$emit('click');
    },
  },

  components: {
    VSvgIcon,
  },
};
</script>

<style lane="postcss">
.option-button {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 12px;
  margin: 0;
  border: none;
  border-bottom: 1px solid #f2f4f7;
  background: none;
  font-size: 14px;
  color: #13171a;
  cursor: pointer;
  transition: background-color 0.25s;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
  outline: none;

  &.disabled {
    color: #a9a9a9;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #f2f4f7;
  }

  &:focused,
  &.active {
    background-color: #f2f4f7;
  }
}

.option-button-icon {
  flex: 0 0 auto;
  margin-left: auto;
  margin-top: 5px;
  transition: transform 0.35s linear;
  transform-origin: center;
}
</style>
