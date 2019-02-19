<template lang="html">
  <button
    :disabled="!auth2Loaded"
    :submit="false"
    class="google-button"
    data-test="submit-button"
    @click="loginWithGoogle"
  >
    <v-svg-icon
      class="google-button__icon"
      name="google"
      width="18px"
      height="18px"
    />
    <span class="google-button__text">Sign in with Google</span>
  </button>
</template>

<script>
import router from '@/router';
import { mapActions } from 'vuex';
import VButton from '@/components/VButton';
import VSvgIcon from '@/components/VSvgIcon';

export default {
  data() {
    const gapi = window.gapi;
    return {
      auth2Loaded: false,
      gapi,
    };
  },
  methods: {
    ...mapActions(['authWithGoogle', 'awaitAuthConfirm']),
    async loginWithGoogle() {
      const auth = gapi.auth2.init({
        client_id: ENV.googleClientId,
        scope: 'profile',
      });
      await auth.signIn();
      try {
        await this.authWithGoogle({
          email: auth.currentUser
            .get()
            .getBasicProfile()
            .getEmail(),
          idToken: auth.currentUser.get().getAuthResponse().id_token,
        });
        await this.awaitAuthConfirm();
      } catch (err) {
        this.handleAuthError(err);
      }
    },
    handleAuthError(err) {
      this.$emit('error', err);
    },
    loadAuth2() {
      this.gapi.load('auth2', () => {
        this.auth2Loaded = true;
      });
    },
    initGoogle() {
      if (this.gapi) {
        console.log('kek1');
        this.loadAuth2();
      } else {
        const unwatch = this.$watch(
          () => window.gapi,
          () => {
            console.log('kek2');
            this.initGoogle();
            this.unwatch();
          },
        );
      }
    },
  },
  created() {
    this.initGoogle();
  },
  components: {
    VButton,
    VSvgIcon,
  },
};
</script>

<style type="postcss">
.google-button {
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
.google-button:hover {
  box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
}
.google-button__icon {
  margin: 8px;
}
.google-button__text {
  font-size: 13px;
  line-height: 34px;
  margin: auto 8px auto 5px;
}
</style>
