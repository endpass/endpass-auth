<template>
  <theme-provider>
    <loading-screen :is-loading="isLoading">
      <layout-screen />
    </loading-screen>
  </theme-provider>
</template>

<script>
import { mapActions } from 'vuex';
import LoadingScreen from '@/components/common/LoadingScreen';
import LayoutScreen from '@/components/screens/Layout';
import ThemeProvider from '@endpass/ui/kit/ThemeProvider';

export default {
  name: 'App',
  data() {
    return {
      isLoading: true,
    };
  },

  methods: {
    ...mapActions(['init']),
  },

  async created() {
    this.isLoading = true;
    await this.init(this.$router);
    this.isLoading = false;
  },
  components: {
    LayoutScreen,
    LoadingScreen,
    ThemeProvider,
  },
};
</script>

<style lang="postcss">
@import '../node_modules/reset.css/reset.css';
</style>

<style lang="postcss">
* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
}

body {
  background: linear-gradient(to bottom, #6d2198 0%, #4b0873 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
}

body,
input,
button,
select {
  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
}

@media (max-width: 768px) {
  body {
    background: #fff;
  }
}

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
