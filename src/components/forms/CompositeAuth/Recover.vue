<template>
  <form @submit.prevent="emitSubmit">
    <form-field>
      <message
        class="v-modal-card-title"
        data-test="form-message"
      >
        Enter recovery seed phrase of your wallet.
      </message>
    </form-field>
    <form-field v-if="error">
      <message
        :error="true"
        data-test="error-message"
      >
        {{ error }}
      </message>
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
        type="submit"
        :disabled="!isSeedPhraseValid || loading"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

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
      return this.seedPhrase.length >= 12;
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
