<template>
  <form data-test="sign-form" @submit.prevent="emitSubmit">
    <form-field v-if="requesterUrl">
      Please apply connect to
      <a :href="requesterUrl" data-test="requester-url">{{ requesterUrl }}</a>
    </form-field>
    <form-field v-if="message">
      <message>
        {{ message }}
      </message>
    </form-field>
    <form-field v-if="error">
      <message :error="true" data-test="error-message">{{ error }}</message>
    </form-field>
    <form-field label="Your wallet account password:">
      <v-input
        v-model="password"
        :autofocus="true"
        :required="true"
        type="password"
        name="password"
        placeholder="Enter your password..."
      />
    </form-field>
    <form-controls>
      <v-button
        :disabled="isLoading || !isFormValid"
        :submit="true"
        type="primary"
        data-test="submit-button"
        >{{ primaryButtonLabel }}</v-button
      >
      <v-button
        v-if="withLogoutBtn"
        :disabled="isLoading"
        type="danger"
        data-test="logout-button"
        @click="emitLogout"
        >Logout</v-button
      >
      <v-button
        :disabled="!closable || isLoading"
        data-test="cancel-button"
        @click="emitCancel"
        >Close</v-button
      >
    </form-controls>
  </form>
</template>

<script>
import VInput from '@/components/common/VInput.vue';
import VSelect from '@/components/common/VSelect.vue';
import VCode from '@/components/common/VCode.vue';
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

export default {
  name: 'PasswordForm',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    message: {
      type: String,
      default: '',
    },

    error: {
      type: String,
      default: null,
    },

    closable: {
      type: Boolean,
      default: true,
    },

    withLogoutBtn: {
      type: Boolean,
      default: false,
    },

    requesterUrl: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    password: '',
  }),

  computed: {
    primaryButtonLabel() {
      return !this.isLoading ? 'Apply' : 'Loading...';
    },

    isFormValid() {
      return !!this.password;
    },
  },

  methods: {
    emitSubmit() {
      if (!this.isFormValid) return;

      this.$emit('submit', this.password);
    },

    emitCancel() {
      this.$emit('cancel');
    },

    emitLogout() {
      this.$emit('logout');
    },
  },

  components: {
    VButton,
    VInput,
    VSelect,
    VCode,
    Message,
    FormField,
    FormControls,
  },
};
</script>
