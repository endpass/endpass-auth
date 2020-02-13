<template>
  <component
    :is="current"
    :email="email"
    :error="error"
    :is-loading="isLoading"
    :challenge-type="challengeType"
    @complete="onComplete"
    @recover="onRecover"
    @recovered="onRecovered"
    @recovery-cancel="onRecoveryCancel"
  />
</template>

<script>
import RecoveryCode from '@/components/modules/RecoveryCode';
import Code from '@/components/modules/Code';
import Error from './modules/Error';
import NoChallenge from './modules/NoChallenge';

import Message from '@/components/common/Message';
import { accountsStore } from '@/store';
import CodeForm from '@/components/forms/Code';
import createLoginController from './LoginController';

export default {
  name: 'LoginProviderContainer',
  accountsStore,

  loginController: createLoginController(),

  props: {
    error: {
      type: String,
      required: true,
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
    current() {
      if (this.error) {
        return Error;
      }

      if (!this.loginChallenge) {
        return NoChallenge;
      }

      if (this.isRecovering) {
        return RecoveryCode;
      }

      return Code;
    },
  },

  methods: {
    onComplete({ code }) {
      this.$emit('code', { code });
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

  components: {
    CodeForm,
    Message,
  },
};
</script>
