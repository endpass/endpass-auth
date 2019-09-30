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
  data() {
    return {
      isLoading: true,
    };
  },

  async created() {
    this.isLoading = true;
    await coreStore.init();
    this.isLoading = false;
  },
  components: {
    ThemeProvider,
    LayoutScreen,
    LoadingScreen,
  },
};
</script>

<style lang="postcss">
@import '../node_modules/reset.css/reset.css';

* {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  min-height: 100%;
}

body {
  background: linear-gradient(to bottom, #6d2198 0%, #4b0873 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;

  &.transparent {
    background: none;
  }
}

body,
input,
button,
select {
  font-family: 'Akkurat Pro', Helvetica, Arial, sans-serif;
}

@media (max-width: 768px) {
  body {
    background: #fff;
  }
}

.form-controls a,
.form-row a {
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
