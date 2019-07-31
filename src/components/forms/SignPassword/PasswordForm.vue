<template>
  <form data-test="sign-form" @submit.prevent="emitSubmit">
    <h3
      v-if="requesterUrl"
      class="v-modal-card-title"
      v-html="$t('components.passwordForm.applyConnectTo')"
    >
      <a :href="requesterUrl" data-test="requester-url">
        {{ requesterUrl }}
      </a>
    </h3>
    <form-item v-if="message">
      <message>
        {{ message }}
      </message>
    </form-item>
    <form-item>
      <v-input
        id="password"
        v-model="password"
        v-validate="'required|min:8'"
        data-vv-as="Password"
        data-vv-name="password"
        autofocus="true"
        required="true"
        type="password"
        name="password"
        :error="errors.first('password') || errorTitle"
        :label="passwordInputLabel"
        :placeholder="$t('components.passwordForm.enterWalletPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-row>
      <v-button
        v-if="withLogoutBtn"
        :disabled="isLoading"
        skin="error"
        type="button"
        size="big"
        data-test="logout-button"
        @click="emitLogout"
      >
        {{ $t('global.logout') }}
      </v-button>
      <v-spacer v-if="withLogoutBtn" :width="16" />
      <v-button
        :disabled="isLoading || !isFormValid"
        size="big"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-row>
  </form>
</template>

<script>
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import formMixin from '@/mixins/form';
import FormRow from '@/components/common/FormRow';
import VSpacer from '@/components/common/VSpacer';
import FormItem from '@/components/common/FormItem';

export default {
  name: 'PasswordForm',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      default: null,
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
    showError: true,
  }),

  computed: {
    errorTitle() {
      return this.showError ? this.error : '';
    },
    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('global.apply')
        : this.$i18n.t('global.loading');
    },

    passwordInputLabel() {
      if (this.email) {
        return this.$i18n.t('components.passwordForm.passwordForEmail', {
          email: this.email,
        });
      }

      return this.$i18n.t('components.passwordForm.walletPassword');
    },
  },

  watch: {
    error: {
      handler() {
        this.showError = true;
      },
    },
    password: {
      handler() {
        this.showError = false;
      },
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
  mixins: [formMixin],

  components: {
    VButton,
    VInput,
    Message,
    FormItem,
    VSpacer,
    FormRow,
  },
};
</script>
