<template>
  <loading-screen :is-loading="true" />
</template>

<script>
import { parseUrl } from '@/util/dom';
import { authStore, coreStore } from '@/store';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'PublicAuth',

  authStore,
  coreStore,

  data: () => ({
    queryParamsMap: {},
  }),

  methods: {
    async handleAuth() {
      const { redirectUrl, withHost } = this.queryParamsMap;

      if (!redirectUrl) return;

      const fullPath = decodeURIComponent(redirectUrl);

      if (withHost) {
        window.location.href = fullPath;
        return;
      }

      const { origin } = parseUrl(fullPath);
      const newPath = fullPath.replace(origin, '');

      this.$router.replace(newPath).catch(() => {});
    },

    cancelAuth() {
      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },
  },

  mounted() {
    const { query } = this.$route;
    const { params } = this.$route;

    const { redirectUrl } = query;

    this.queryParamsMap = query;

    if (redirectUrl) {
      this.$options.authStore.setAuthParams({
        redirectUrl: decodeURIComponent(redirectUrl),
      });
    }

    switch (true) {
      case params.isAuthCancel:
        this.cancelAuth();
        break;

      case params.isAuthSuccess: {
        this.handleAuth();
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
