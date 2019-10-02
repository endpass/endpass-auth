<template>
  <component
    :is="currentForm"
    :email="email"
    @toggle="toggleForm"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<script>
import PasswordForm from './PasswordForm';
import RecoverForm from './RecoverForm';

export default {
  name: 'RegularPassword',

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    currentForm: PasswordForm,
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

  components: {
    PasswordForm,
    RecoverForm,
  },
};
</script>
