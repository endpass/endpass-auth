<template>
  <form @submit.prevent="emitSubmit">
    <form-field>
      <message data-test="form-message">
        Enter recovery seed phrase of your wallet.
      </message>
    </form-field>
    <form-field v-if="error">
      <message :error="true" data-test="error-message">{{ error }}</message>
    </form-field>
    <form-field>
      <v-input
        v-model="seedPhrase"
        label="Seed phrase"
        name="seedPhrase"
        placeholder="Seed phrase"
        required
      />
    </form-field>
    <form-controls>
      <v-button
        :disabled="!isSeedPhraseValid || loading"
        :submit="true"
        type="primary"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import VButton from '../VButton.vue';
import VInput from '../VInput.vue';
import Message from '../Message.vue';
import FormField from '../FormField.vue';
import FormControls from '../FormControls.vue';

export default {
  name: 'RecoverForm',

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
    seedPhrase: '',
  }),

  computed: {
    primaryButtonLabel() {
      return !this.loading ? 'Recover access' : 'Loading...';
    },

    isSeedPhraseValid() {
      return this.seedPhrase.split(' ').length >= 12;
    },
  },

  methods: {
    emitSubmit() {
      if (this.isSeedPhraseValid) {
        this.$emit('submit', this.seedPhrase);
      }
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
