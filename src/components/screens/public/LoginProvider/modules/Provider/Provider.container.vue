<template>
  <provider
    :is-loading="isLoading"
    :is-closable="isClosable"
    @close="onClose"
  >
    <component
      :is="currentComponent"
      :email="email"
      :error="error"
      :challenge-type="challengeType"
      :oauth-login-challenge="oauthLoginChallenge"
      @complete="onComplete"
      @recover="onRecover"
      @recovered="onRecovered"
      @recovery-cancel="onRecoveryCancel"
    />
  </provider>
</template>

<script>
import Provider from './Provider.view';
import CodeRecovery from '@/components/modules/CodeRecovery';
import CodeRequest from './modules/CodeRequest';
import Error from '@/components/modules/Error';
import NoChallenge from './modules/NoChallenge';

import LoadingScreen from '@/components/common/LoadingScreen';
import VFrame from '@/components/common/VFrame';
import { CHALLENGE_TYPES } from '@/constants';

export default {
  name: 'ProviderContainer',

  props: {
    error: {
      type: String,
      default: '',
    },

    isLoading: {
      type: Boolean,
      required: true,
    },

    isClosable: {
      type: Boolean,
      default: false,
    },

    oauthLoginChallenge: {
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
      validator(value) {
        return Object.keys(CHALLENGE_TYPES).includes(value);
      },
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

      if (!this.oauthLoginChallenge) {
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

    onClose() {
      this.$emit('close');
    },
  },

  components: {
    Provider,
    VFrame,
    LoadingScreen,
  },
};
</script>
