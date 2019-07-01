<template>
  <form
    class="form-otp"
    @submit.prevent="emitSubmit"
  >
    <message
      class="v-modal-card-title"
      data-test="form-message"
      v-html="$t('components.otp.enterCode')"
    />
    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code') || error"
        autofocus="true"
        name="code"
        :placeholder="$t('components.otp.enterReceivedCode')"
        data-test="email-input"
      />
    </form-item>
    <form-row>
      <a
        :disabled="loading"
        href="#"
        data-test="recovery-link"
        @click.prevent="emitRecoverEvent"
      >
        {{ $t('components.otp.noCode') }}
      </a>
      <v-button
        :disabled="!isCodeValid || loading"
        type="submit"
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
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import Message from '@/components/common/Message.vue';
import formMixin from '@/mixins/form';

export default {
  name: 'OtpForm',

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
    code: '',
  }),

  computed: {
    primaryButtonLabel() {
      return !this.loading
        ? this.$i18n.t('global.confirm')
        : this.$i18n.t('global.loading');
    },

    codeErrorMessage() {
      return this.isCodeValid ? null : 'Invalid code';
    },

    isCodeValid() {
      return /^\d{6}$/.test(this.code);
    },
  },

  methods: {
    emitSubmit() {
      if (this.isCodeValid) {
        this.$emit('submit', this.code);
      }
    },
    emitRecoverEvent() {
      if (!this.loading) {
        this.$emit('recover');
      }
    },
  },

  mixins: [formMixin],

  components: {
    VButton,
    VInput,
    Message,
    FormItem,
    FormRow,
  },
};
</script>

<style lang="postcss">
.form-otp {
  a {
    margin-right: 10px;
    width: 100%;
  }
}
</style>
