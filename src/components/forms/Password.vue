<template>
  <form @submit.prevent="handleSubmit">
    <form-field>
      <message>
        Enter password of your current wallet to continue:
      </message>
    </form-field>
    <form-field v-if="error">
      <message :error="true" data-test="error-message">{{ error }}</message>
    </form-field>
    <form-field>
      <v-input
        v-model="password"
        :required="true"
        name="password"
        type="password"
        placeholder="Enter your wallet password..."
        data-test="password-input"
      />
    </form-field>
    <form-controls>
      <v-button
        :disabled="!isFormValid || loading"
        :submit="true"
        :fluid="true"
        type="primary"
        data-test="submit-button"
        >{{ primaryButtonLabel }}</v-button
      >
    </form-controls>
  </form>
</template>

<script>
import VInput from '@/components/common/VInput.vue';
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

export default {
  name: 'PasswordForm',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    password: '',
  }),

  computed: {
    primaryButtonLabel() {
      return !this.loading ? 'Submit' : 'Loading...';
    },

    isFormValid() {
      return !!this.password;
    },
  },

  methods: {
    handleSubmit() {
      if (!this.isFormValid) return;

      this.$emit('submit', this.password);
    },
  },

  components: {
    VButton,
    VInput,
    Message,
    FormField,
    FormControls,
  },
};
</script>
