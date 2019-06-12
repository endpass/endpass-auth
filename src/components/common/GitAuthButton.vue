<template>
  <button
    :submit="false"
    class="github-button"
    data-test="submit-button"
    @click="loginWithGithub"
  >
    <v-svg-icon
      class="github-button__icon"
      name="github"
      width="18px"
      height="18px"
    />
    <span class="github-button__text">Sign in with Github</span>
  </button>
</template>

<script>
import { loginWithGithub } from 'github-oauth-popup';
import { mapActions } from 'vuex';
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
  },
};
</script>

<style lang="postcss">
.github-button {
  display: flex;
  width: 180px;
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  background-color: #fff;
  background-image: none;
  color: #262626;
  cursor: pointer;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  font-family: Roboto, arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.21px;
  margin-left: 6px;
  margin-right: 6px;
  vertical-align: top;
}
.github-button:hover {
  box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
}
.github-button__icon {
  margin: 8px;
}
.github-button__text {
  font-size: 13px;
  line-height: 34px;
  margin: auto 8px auto 5px;
}
</style>
