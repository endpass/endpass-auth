<template>
  <v-frame
    title=""
    :is-closable="false"
  >
    <message
      v-if="!hasLoginChallenge"
      :error="true"
      data-test="error-message"
    >
      {{ $t('components.loginProviderPassword.loginChallenge') }}
    </message>
    <code-form
      v-else
      :email="email"
      password=""
      :is-sign-up="false"
      :is-closable="false"
      :submit-handler="authWithCode"
    />
  </v-frame>
</template>

<script>
import VFrame from '@/components/common/VFrame';
import Message from '@/components/common/Message';
import { accountsStore } from '@/store';
import CodeForm from '@/components/forms/Code';
import createLoginController from './LoginController';

export default {
  name: 'LoginProvider',
  accountsStore,

  loginController: createLoginController(),

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
    async authWithCode({ code }) {
      await this.$options.loginController.authWithCode({
        challengeId: this.loginChallenge,
        code,
      });
    },
  },

  components: {
    CodeForm,
    Message,
    VFrame,
  },
};
</script>
