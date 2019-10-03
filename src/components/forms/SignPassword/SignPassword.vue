<template>
  <password-form
    :is-loading="isLoading"
    :error="error"
    :is-closable="isDialog"
    :with-logout-btn="withLogoutBtn"
    :requester-url="requesterUrl"
    :message="message"
    :email="email"
    @cancel="handleCancel"
    @submit="handleSignSubmit"
    @logout="handleLogout"
  />
</template>

<script>
import PasswordForm from '@/components/forms/SignPassword/PasswordForm';
import { accountsStore, coreStore } from '@/store';

export default {
  name: 'SignPasswordForm',

  props: {
    withLogoutBtn: {
      type: Boolean,
      default: false,
    },

    requesterUrl: {
      type: String,
      default: '',
    },

    message: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      default: null,
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },
  },

  accountsStore,
  coreStore,

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    handleLogout() {
      this.$options.coreStore.logout();
      this.handleCancel();
    },

    async handleSignSubmit(password) {
      this.$emit('submit', password);
    },

    handleCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    PasswordForm,
  },
};
</script>
