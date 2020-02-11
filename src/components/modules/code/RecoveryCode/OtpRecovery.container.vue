<template>
  <loading-screen :is-loading="isLoading">
    <component
      :is="current"
      :error="error"
      @send-code="onSendCode"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </loading-screen>
</template>

<script>
import NoPhoneView from './modules/NoPhone.view';
import WithPhoneView from './modules/WithPhone.view';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
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
    current() {
      return this.isPhoneExist ? WithPhoneView : NoPhoneView;
    },
  },

  methods: {
    onSendCode() {
      this.$emit('send-code');
    },

    onSubmit() {
      this.$emit('submit', {
        code: this.code,
      });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    LoadingScreen,
  },
};
</script>
