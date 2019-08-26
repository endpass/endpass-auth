<template>
  <v-button
    skin="social"
    type="button"
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
import { mapActions } from 'vuex';
import VButton from '@endpass/ui/kit/VButton';
import VSvgIcon from '@/components/common/VSvgIcon.vue';

export default {
  methods: {
    ...mapActions(['authWithGitHub']),
    async loginWithGithub() {
      try {
        const response = await loginWithGithub({
          client_id: ENV.VUE_APP_GIT_CLIENT_ID,
          scope: 'user:email',
        });
        await this.authWithGitHub(response.code);
        this.$emit('submit');
      } catch (e) {
        this.handleAuthError(e);
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
