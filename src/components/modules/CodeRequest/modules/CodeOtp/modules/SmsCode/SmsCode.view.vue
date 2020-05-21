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
        autocomplete="off"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code')"
        name="code"
        :placeholder="$t('components.smsCode.enterReceivedCode')"
        data-test="code-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <remember-me
        v-model="isRemember"
        data-test="remember-me-checkbox"
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
import RememberMe from '../RememberMe';

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
    isRemember: false,
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
      this.$emit('submit', {
        code: this.code,
        isRemember: this.isRemember,
      });
    },

    sendCode() {
      this.$emit('send-code');
    },
  },

  mixins: [formMixin],

  components: {
    RememberMe,
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
