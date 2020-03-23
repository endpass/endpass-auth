<template>
  <v-button
    skin="social"
    type="button"
    :is-loading="isLoading"
    data-test="submit-button-github"
    @click.native="loginWithGithub"
  >
    <v-svg-icon
      slot="iconBefore"
      name="github"
      width="18px"
      height="18px"
    />
    {{ $t('components.gitAuthButton.authWithGitHub') }}
  </v-button>
</template>

<script>
import { loginWithGithub } from 'github-oauth-popup';
import VButton from '@endpass/ui/kit/VButton';
import VSvgIcon from '@/components/common/VSvgIcon.vue';
import { authStore } from '@/store';

export default {
  name: 'GitAuthButton',

  authStore,

  data: () => ({
    isLoading: false,
  }),

  methods: {
    async loginWithGithub() {
      try {
        this.isLoading = true;
        const response = await loginWithGithub({
          client_id: ENV.VUE_APP_GIT_CLIENT_ID,
          scope: 'user:email',
        });
        const { email } = await this.$options.authStore.authWithGitHub(
          response.code,
        );
        this.$emit('submit', { email });
      } catch (e) {
        this.handleAuthError(e);
      } finally {
        this.isLoading = false;
      }
    },
    handleAuthError(err) {
      this.$emit('error', err);
    },
  },
  components: {
    VSvgIcon,
    VButton,
  },
};
</script>

<style lang="postcss">
.svg-icon--github {
  margin: 0 5px 0 0;
}
</style>
