<template>
  <form @submit.prevent="emitSubmit">
    <message
      class="v-modal-card-title"
      data-test="form-message"
      v-html="$t('components.recover.enterSeed')"
    />
    <form-item>
      <v-input
        v-model="seedPhrase"
        :error="error"
        label="Seed phrase"
        name="seedPhrase"
        :placeholder="$t('components.recover.seedPhrase')"
        required
      />
    </form-item>
    <form-row>
      <v-button
        type="submit"
        :disabled="!isSeedPhraseValid || loading"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import Message from '@/components/common/Message.vue';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';

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
      return !this.loading
        ? this.$i18n.t('global.confirm')
        : this.$i18n.t('global.loading');
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
    FormItem,
    FormRow,
  },
};
</script>
