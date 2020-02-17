<template>
  <component
    :is="currentComponent"
    :email="email"
    :error="error"
    :is-loading="isLoading"
    :challenge-type="challengeType"
    :login-challenge="loginChallenge"
    @complete="onComplete"
    @recover="onRecover"
    @recovered="onRecovered"
    @recovery-cancel="onRecoveryCancel"
  />
</template>

<script>
import CodeRecovery from '@/components/modules/CodeRecovery';
import CodeRequest from './modules/CodeRequest';
import Error from '@/components/modules/Error';
import NoChallenge from './modules/NoChallenge';

import { accountsStore } from '@/store';

export default {
  name: 'ProviderContainer',
  accountsStore,

  props: {
    error: {
      type: String,
      default: '',
    },

    isLoading: {
      type: Boolean,
      required: true,
    },

    loginChallenge: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      default: '',
    },

    challengeType: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isRecovering: false,
  }),

  computed: {
    currentComponent() {
      if (this.error) {
        return Error;
      }

      if (!this.loginChallenge) {
        return NoChallenge;
      }

      if (this.isRecovering) {
        return CodeRecovery;
      }

      return CodeRequest;
    },
  },

  methods: {
    onComplete({ redirect }) {
      this.$emit('complete', { redirect });
    },

    onRecover() {
      this.isRecovering = true;
    },

    onRecovered() {
      this.isRecovering = false;
    },

    onRecoveryCancel() {
      this.isRecovering = false;
    },
  },
};
</script>
