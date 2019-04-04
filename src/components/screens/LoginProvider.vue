<template>
  <v-frame>
    <password-form
      :error="error"
      :loading="loading"
      @submit="handlePasswordSubmit"
    />
  </v-frame>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { queryParamsToObject } from '@/util/url';
import VFrame from '@/components/common/VFrame';
import PasswordForm from '@/components/forms/PasswordForm';

export default {
  name: 'LoginProvider',

  data: () => ({
    params: {},
    error: null,
  }),

  computed: {
    ...mapState({
      loading: state => state.core.loading,
      isAuthorized: state => state.accounts.isAuthorized,
    }),
  },

  methods: {
    ...mapActions(['authWithHydra']),

    async handlePasswordSubmit(password) {
      const { challengeId } = this.params;

      if (!challengeId) return;

      try {
        await this.authWithHydra({ challengeId, password });
      } catch (err) {
        this.error = err.message;
      }
    },
  },

  mounted() {
    const { search } = window.location;

    this.params = queryParamsToObject(search);

    if (!this.params.challengeId) {
      this.error =
        'You should provide challenge_id param in url, add it and try again!';
      return;
    }

    if (!this.isAuthorized) {
      this.$router.replace(`/public/auth${search}`);
    }
  },

  components: {
    VFrame,
    PasswordForm,
  },
};
</script>
