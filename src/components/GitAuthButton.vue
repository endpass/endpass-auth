<template>
  <v-button @click="loginWithGithub">
    <v-svg-icon name="github" width="30" height="30" />
  </v-button>
</template>

<script>
import { loginWithGithub } from 'github-oauth-popup';
import VButton from '@/components/VButton';
import VSvgIcon from '@/components/VSvgIcon';
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['authWithGitHub', 'awaitAuthConfirm']),
    async loginWithGithub() {
      try {
        const response = await loginWithGithub({
          client_id: ENV.gitClientId,
          scope: 'user:email',
        });
        await this.authWithGitHub(response.code);
        await this.awaitAuthConfirm();
      } catch (e) {
        this.handleAuthError(e);
      }
    },
    handleAuthError(err) {
      this.$emit('error', err);
    },
  },
  components: {
    VButton,
    VSvgIcon,
  },
};
</script>
