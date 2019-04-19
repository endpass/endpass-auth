<template>
  <div class="app_is-loading" v-if="isLoading">
    <LoadingScreen />
  </div>
  <router-view v-else />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VFrame from '@/components/common/VFrame';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'App',
  data() {
    return {
      isLoading: true,
    };
  },

  computed: {
    ...mapGetters(['isDialog']),
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
    LoadingScreen,
    VFrame,
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

.app_is-loading {
  background: #fff;
  position: relative;
  padding: 30px 15px 15px;
  min-height: 100px;
  font-size: 1em;
  max-width: 100px;
  margin: 0 auto;
  border-radius: 4px;
  margin-top: 20px;
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
