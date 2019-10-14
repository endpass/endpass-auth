<template>
  <loading-screen :is-loading="isLoading">
    <component
      :is="currentForm"
      :email="email"
      @close="toggleForm"
      @recover="toggleForm"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </loading-screen>
</template>

<script>
import PasswordForm from './PasswordForm';
import RecoverForm from './RecoverForm';
import CreateRegularPassword from '@/components/forms/CreateRegularPassword';
import { authStore } from '@/store';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'RegularPassword',

  authStore,

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    currentForm: null,
    isLoading: true,
  }),

  methods: {
    onSubmit(password) {
      this.$emit('submit', password);
    },

    onCancel() {
      this.$emit('cancel');
    },

    toggleForm() {
      this.currentForm =
        this.currentForm === PasswordForm ? RecoverForm : PasswordForm;
    },
  },

  async mounted() {
    this.isLoading = true;
    try {
      const isPasswordExist = await this.$options.authStore.checkRegularPassword(
        this.email,
      );

      this.currentForm = isPasswordExist ? PasswordForm : CreateRegularPassword;
    } finally {
      this.isLoading = false;
    }
  },

  components: {
    CreateRegularPassword,
    LoadingScreen,
    PasswordForm,
    RecoverForm,
  },
};
</script>
