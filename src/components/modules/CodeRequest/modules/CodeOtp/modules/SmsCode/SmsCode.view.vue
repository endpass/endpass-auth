<template>
  <form
    data-test="sms-code-form"
    @submit.prevent="onSubmit"
  >
    <v-title>
      {{ $t('components.smsCode.title') }}
    </v-title>
    <v-description>
      {{ $t('components.smsCode.description') }}
    </v-description>

    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code')"
        name="code"
        :placeholder="$t('components.smsCode.enterReceivedCode')"
        data-test="code-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <v-button
        :disabled="!isFormValid || isLoading"
        :is-loading="isLoading"
        type="submit"
        data-test="submit-button"
      >
        {{ $t('global.confirm') }}
      </v-button>
    </form-item>
    <form-row class="v-fs-14 v-text-center">
      <send-code
        :is-loading="isLoading"
        @send-code="sendCode"
      />
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import SendCode from '@/components/common/SendCode';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'SmsCodeView',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    error: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    code: '',
  }),

  watch: {
    error: {
      handler(msg) {
        this.$validator.errors.removeById('sendCodeId');

        if (!msg) return;

        this.$validator.errors.add({
          id: 'sendCodeId',
          field: 'code',
          msg,
        });
      },
      immediate: true,
    },
  },

  methods: {
    onSubmit() {
      this.$emit('submit', { code: this.code });
    },

    sendCode() {
      this.$emit('send-code');
    },
  },

  mixins: [formMixin],

  components: {
    VTitle,
    VDescription,
    SendCode,
    VButton,
    VInput,
    FormItem,
    FormRow,
  },
};
</script>
