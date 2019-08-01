<template>
  <button
    :class="{ 'trigger-button': true, 'is-loading': isLoading }"
    type="button"
    @click="handleClick"
  >
    <span class="trigger-button-spinner">
      <spinner
        v-if="isLoading"
        :size="32"
      />
    </span>
  </button>
</template>

<script>
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
  box-shadow: 2px 6px 8px rgba(36, 43, 46, 0.15);
  background-image: url('../../assets/widget-button-backgroud.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.trigger-button.is-loading {
  background-color: #4b016f;
}

.trigger-button-spinner {
  flex: 0 0 auto;
}
</style>
