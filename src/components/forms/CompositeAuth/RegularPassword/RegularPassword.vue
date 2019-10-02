<template>
  <loading-screen v-if="isLoading" />
  <component
    :is="currentForm"
    v-else-if="!isLoading"
    :email="email"
    @close="toggleForm"
    @recover="toggleForm"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<script>
import PasswordForm from './PasswordForm';
import RecoverForm from './RecoverForm';
import CreatePassword from './CreatePassword';
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

      this.currentForm = isPasswordExist ? PasswordForm : CreatePassword;
    } finally {
      this.isLoading = false;
    }
  },

  components: {
    LoadingScreen,
    PasswordForm,
    RecoverForm,
  },
};
</script>
