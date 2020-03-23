<template lang="html">
  <v-button
    :disabled="isIniting"
    :is-loading="isLoading"
    skin="social"
    type="button"
    data-test="submit-button-google"
    @click.native="onLogin"
  >
    <v-svg-icon
      slot="iconBefore"
      name="google"
      width="18px"
      height="18px"
    />
    {{ $t('components.googleAuthButton.authWithGoogle') }}
  </v-button>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VSvgIcon from '@/components/common/VSvgIcon';
import { authStore } from '@/store';

export default {
  data: () => ({
    isIniting: true,
    isLoading: true,
    intervalId: null,
  }),

  authStore,

  methods: {
    async onLogin() {
      try {
        this.isLoading = true;

        // eslint-disable-next-line no-undef
        const auth = gapi.auth2.init({
          client_id: ENV.VUE_APP_GOOGLE_CLIENT_ID,
          scope: 'profile',
        });
        await auth.signIn();
        const { email } = await this.$options.authStore.authWithGoogle({
          email: auth.currentUser
            .get()
            .getBasicProfile()
            .getEmail(),
          idToken: auth.currentUser.get().getAuthResponse().id_token,
        });
        this.$emit('submit', { email });
      } catch (err) {
        this.handleAuthError(err);
      } finally {
        this.isLoading = false;
      }
    },

    handleAuthError(err) {
      this.$emit('error', err);
    },

    loadAuth2() {
      window.gapi.load('auth2', () => {
        this.isIniting = false;
        this.isLoading = false;
      });
    },

    initGoogle() {
      if (window.gapi) {
        this.loadAuth2();
      } else {
        this.intervalId = setInterval(() => {
          if (window.gapi) {
            this.loadAuth2();
            clearInterval(this.intervalId);
          }
        }, 300);
      }
    },
  },
  created() {
    this.initGoogle();
  },
  destroyed() {
    clearInterval(this.intervalId);
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
