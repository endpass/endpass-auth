<template lang="html">
  <v-button
    :disabled="!auth2Loaded"
    skin="social"
    type="button"
    data-test="submit-button"
    @click.native="loginWithGoogle"
  >
    <v-svg-icon
      slot="iconBefore"
      name="google"
      width="18px"
      height="18px"
    />
    <span class="google-button__text">{{
      $t('components.googleAuthButton.authWithGoogle')
    }}</span>
  </button>
</template>

<script>
import { mapActions } from 'vuex';
import VButton from '@endpass/ui/kit/VButton';
import VSvgIcon from '@/components/common/VSvgIcon';

export default {
  data() {
    return {
      auth2Loaded: false,
      interval: null,
    };
  },
  methods: {
    ...mapActions(['authWithGoogle']),
    async loginWithGoogle() {
      // eslint-disable-next-line no-undef
      const auth = gapi.auth2.init({
        client_id: ENV.VUE_APP_GOOGLE_CLIENT_ID,
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
        this.$emit('submit');
      } catch (err) {
        this.handleAuthError(err);
      }
    },
    handleAuthError(err) {
      this.$emit('error', err);
    },
    loadAuth2() {
      window.gapi.load('auth2', () => {
        this.auth2Loaded = true;
      });
    },
    initGoogle() {
      if (window.gapi) {
        this.loadAuth2();
      } else {
        this.interval = setInterval(() => {
          if (window.gapi) {
            this.loadAuth2();
            clearInterval(this.interval);
          }
        }, 300);
      }
    },
  },
  created() {
    this.initGoogle();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  components: {
    VSvgIcon,
    VButton,
  },
};
</script>

<style lang="postcss">
.svg-icon--google {
  margin: 0 5px 0 0;
}
</style>
