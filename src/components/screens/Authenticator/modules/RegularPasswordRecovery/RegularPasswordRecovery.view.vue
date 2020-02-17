<template>
  <form
    data-test="regular-password-form"
    @submit.prevent="onSubmit"
  >
    <v-title>
      {{ $t('components.regularPasswordRecover.title') }}
    </v-title>
    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        type="password"
        required
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password')"
        name="password"
        :placeholder="$t('components.regularPasswordRecover.newPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-item>
      <v-input
        v-model="repeatPassword"
        v-validate="{ required: true, confirmed: password }"
        type="password"
        required
        data-vv-as="password"
        data-vv-name="repeatPassword"
        :error="errors.first('repeatPassword')"
        name="repeatPassword"
        :placeholder="$t('components.regularPasswordRecover.repeatPassword')"
        data-test="repeat-password-input"
      />
    </form-item>
    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code')"
        name="code"
        :label="$t('components.regularPasswordRecover.labelCode')"
        :placeholder="$t('components.regularPasswordRecover.placeholderCode')"
        data-test="code-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <form-controls>
        <v-button
          :disabled="isLoading"
          skin="quaternary"
          data-test="cancel-button"
          type="button"
          @click="onCancel"
        >
          {{ $t('global.cancel') }}
        </v-button>
        <v-button
          :disabled="!isSubmitEnable"
          :is-loading="isLoading"
          type="submit"
          data-test="submit-button"
        >
          {{ $t('global.confirm') }}
        </v-button>
      </form-controls>
    </form-item>
    <form-row class="v-fs-14 v-text-center">
      <send-code
        :is-loading="isLoading"
        data-test="send-code-button"
        @send-code="onSendCode"
      />
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import FormControls from '@/components/common/FormControls';
import SendCode from '@/components/common/SendCode';

export default {
  name: 'RegularPasswordRecoveryView',

  props: {
    email: {
      type: String,
      required: true,
    },
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
    password: '',
    repeatPassword: '',
    code: '',
  }),

  computed: {
    isSubmitEnable() {
      return this.isFormValid && !this.isLoading;
    },
  },

  watch: {
    error(msg) {
      if (!msg) {
        this.$validator.errors.removeById('sendCodeId');
        return;
      }

      this.$validator.errors.add({
        id: 'sendCodeId',
        field: 'code',
        msg,
      });
    },
  },

  methods: {
    async onSubmit() {
      this.$emit('submit', {
        password: this.password,
        code: this.code,
      });
    },

    onCancel() {
      this.$emit('cancel');
    },

    onSendCode() {
      this.$emit('send-code');
    },
  },

  mixins: [formMixin],

  components: {
    SendCode,
    FormControls,
    VTitle,
    VButton,
    VInput,
    FormItem,
    FormRow,
  },
};
</script>
