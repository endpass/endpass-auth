<template>
  <loading-screen :is-loading="isLoading">
    <component
      :is="currentComponent"
      :error="error"
      @send-code="onSendCode"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </loading-screen>
</template>

<script>
import LoadingScreen from '@/components/common/LoadingScreen';
import NoPhone from './modules/NoPhone';
import WithPhone from './modules/WithPhone';

export default {
  name: 'RecoveryPhoneContainer',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
    },

    isPhoneExist: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    currentComponent() {
      return this.isPhoneExist ? WithPhone : NoPhone;
    },
  },

  methods: {
    onSendCode() {
      this.$emit('send-code');
    },

    onSubmit({ code }) {
      this.$emit('submit', { code });
    },

    onCancel() {
      this.$emit('recovery-cancel');
    },
  },

  components: {
    LoadingScreen,
  },
};
</script>
