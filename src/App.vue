<template>
  <theme-provider>
    <loading-screen :is-loading="isLoading">
      <layout-screen />
    </loading-screen>
  </theme-provider>
</template>

<script>
import ThemeProvider from '@endpass/ui/kit/ThemeProvider';
import LoadingScreen from '@/components/common/LoadingScreen';
import LayoutScreen from '@/components/screens/Layout';
import { coreStore } from '@/store';

export default {
  name: 'App',

  coreStore,

  computed: {
    isLoading() {
      return this.$options.coreStore.isIniting;
    },
  },

  components: {
    ThemeProvider,
    LayoutScreen,
    LoadingScreen,
  },
};
</script>

<style lang="postcss">
@import './css/main.scss';

.form-controls a {
  font-size: 0.85rem;
  color: #4d4d4d;
  text-decoration: none;

  &:hover {
    color: #4b0472;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;

    &:hover {
      color: #4d4d4d;
    }
  }
}
</style>
