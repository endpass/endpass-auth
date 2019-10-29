<template>
  <screen class="auth-screen-centered">
    <v-modal-card
      :is-closable="$options.coreStore.isDialog"
      @close="onCancel"
    >
      <composite-auth-form
        :is-closable="$options.coreStore.isDialog"
        :is-public="true"
        @cancel="onCancel"
        @authorize="onAuth"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import { parseUrl } from '@/util/dom';
import { authStore, coreStore } from '@/store';

export default {
  name: 'PublicAuth',

  authStore,
  coreStore,

  data: () => ({
    queryParamsMap: {},
  }),

  methods: {
    async onAuth() {
      const { redirectUrl, withHost } = this.queryParamsMap;

      if (!redirectUrl) return;

      const fullPath = decodeURIComponent(redirectUrl);

      if (withHost) {
        window.location.href = fullPath;
        return;
      }

      const { origin } = parseUrl(fullPath);
      const newPath = fullPath.replace(origin, '');

      this.$router.replace(newPath);
    },

    onCancel() {
      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },
  },

  mounted() {
    const { query } = this.$route;
    const { redirectUrl } = query;

    this.queryParamsMap = query;

    if (redirectUrl) {
      this.$options.authStore.setAuthParams({
        redirectUrl: decodeURIComponent(redirectUrl),
      });
    }
  },

  components: {
    Screen,
    VModalCard,
    CompositeAuthForm,
  },
};
</script>

<style>
.auth-screen-centered {
  display: flex;
  justify-content: center;
}
</style>
