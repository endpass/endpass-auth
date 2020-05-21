<template>
  <form
    data-test="recover-otp"
    @submit.prevent="onSubmit"
  >
    <v-title>
      {{ $t('components.recoverOtpSms.title') }}
    </v-title>

    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        autocomplete="off"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code')"
        name="code"
        :placeholder="$t('components.appCode.enterReceivedCode')"
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
          :disabled="!isFormValid || isLoading"
          :is-loading="isLoading"
          type="submit"
          data-test="submit-button"
        >
          {{ $t('global.confirm') }}
        </v-button>
      </form-controls>
    </form-item>
    <form-row class="v-fs-14 v-text-center">
      <v-link
        :disabled="isLoading"
        role="button"
        data-test="recovery-link"
        @click.prevent="onSendCode"
      >
        {{ $t('components.recoverOtpSms.sendTitle') }}
      </v-link>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import VLink from '@endpass/ui/kit/VLink';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import FormControls from '@/components/common/FormControls';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'WithPhone',

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
    onSendCode() {
      this.$emit('send-code');
    },

    onSubmit() {
      this.$emit('submit', {
        code: this.code,
      });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  mixins: [formMixin],

  components: {
    VTitle,
    VLink,
    VButton,
    VInput,
    FormItem,
    FormRow,
    FormControls,
  },
};
</script>
