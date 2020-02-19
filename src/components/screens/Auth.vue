<template>
  <loading-screen :is-loading="true" />
</template>

<script>
import { authStore, coreStore } from '@/store';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'Auth',

  authStore,
  coreStore,

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    cancelAuth() {
      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },

    handleAuth({ serverMode } = {}) {
      this.$options.authStore.confirmAuth(serverMode);
    },
  },

  mounted() {
    const { params } = this.$route;

    switch (true) {
      case params.isAuthCancel:
        this.cancelAuth();
        break;

      case params.isAuthSuccess: {
        const { serverMode } = params;
        this.handleAuth({ serverMode });
        break;
      }

      default:
        this.$router.replace({ name: 'SignIn' }).catch(() => {});
    }
  },

  components: {
    LoadingScreen,
  },
};
</script>
