<template>
  <div v-if="isLoading">
    <div class="loading-screen">
      <div class="loading-screen__spinner">
        <spinner />
      </div>
    </div>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script>
import Spinner from '@/components/common/Spinner';

export default {
  name: 'LoadingScreen',

  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    Spinner,
  },
};
</script>

<style lang="postcss">
.loading-screen {
  padding: 30px 15px 15px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.loading-screen__spinner {
  flex: 0 0 auto;
}
</style>
