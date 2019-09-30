<template>
  <form
    class="form-otp"
    @submit.prevent="onSubmit"
  >
    <message
      class="v-modal-card-title"
      data-test="form-message"
      v-html="$t('components.regularPasswordRecover.title')"
    />
    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password') || error"
        name="password"
        type="password"
        :placeholder="$t('components.regularPasswordRecover.newPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-row>
      <v-button
        :disabled="isLoading"
        data-test="submit-button"
        @click="closeForm"
      >
        {{ $t('global.cancel') }}
      </v-button>
      <v-button
        :disabled="!isFormValid || isLoading"
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
import { authStore, coreStore } from '@/store';

export default {
  name: 'PasswordForm',

  authStore,
  coreStore,

  props: {
    email: {
      type: String,
      required: true,
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
    isLoading() {
      return this.$options.coreStore.loading;
    },

    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('global.confirm')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    onSubmit() {
      this.$emit('submit', this.password);
    },

    closeForm() {
      this.$emit('recover-success');
    },

    async sendCode() {
      try {
        this.$validator.errors.removeById('sendCodeId');
        await this.$options.authStore.sendCode({ email: this.email });
      } catch (error) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.emailCode.sendError'),
          id: 'sendCodeId',
        });
      }
    },
  },

  // mounted() {
  //   this.sendCode();
  // },

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
