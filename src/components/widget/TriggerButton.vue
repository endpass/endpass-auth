<template>
  <button
    class="trigger-button"
    type="button"
    @click="handleClick"
  >
    <span class="trigger-button-icon">
      <v-svg-icon
        v-if="!isLoading"
        name="widget-logo"
        width="25px"
        height="32px"
      />
      <spinner
        v-else
        :size="32"
      />
    </span>
  </button>
</template>

<script>
import VSvgIcon from '@/components/common/VSvgIcon';
import Spinner from '@/components/common/Spinner';

export default {
  name: 'TriggerButton',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleClick() {
      this.$emit('click');
    },
  },

  components: {
    VSvgIcon,
    Spinner,
  },
};
</script>

<style lang="postcss">
.trigger-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: #4b016f;
  box-shadow: 2px 6px 8px rgba(36, 43, 46, 0.15);
}

.trigger-button-icon {
  flex: 0 0 auto;
}
</style>
