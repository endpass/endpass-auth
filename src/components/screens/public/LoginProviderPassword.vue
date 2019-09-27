<template>
  <v-frame :is-closable="false">
    <message
      v-if="!hasLoginChallenge"
      :error="true"
      data-test="error-message"
    >
      {{ $t('components.loginProviderPassword.loginChallenge') }}
    </message>
    <template v-else>
      <sign-password
        :is-loading="isLoading"
        :email="email"
        :error="error"
        @submit="handlePasswordSubmit"
      />
    </template>
  </v-frame>
</template>

<script>
import VFrame from '@/components/common/VFrame';
import Message from '@/components/common/Message';
import SignPassword from '@/components/formsComposite/SignPassword';
import { accountsStore } from '@/store';

export default {
  name: 'LoginProvider',
  accountsStore,

  props: {
    loginChallenge: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    error: null,
    isLoading: false,
  }),

  computed: {
    hasLoginChallenge() {
      return !!this.loginChallenge;
    },
  },

  methods: {
    async handlePasswordSubmit(password) {
      try {
        this.isLoading = true;
        const { redirect } = await this.$options.accountsStore.authWithOauth({
          challengeId: this.loginChallenge,
          password,
        });
        window.location.href = redirect;
        return; // must show loader until redirect not happen
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
  },

  components: {
    SignPassword,
    Message,
    VFrame,
  },
};
</script>
