<template>
  <form
    data-test="sign-form"
    @submit.prevent="emitSubmit"
  >
    <form-field v-if="requesterUrl">
      <h3 class="v-modal-card-title">
        {{ $t('components.passwordForm.applyConnectTo') }}
        <a
          :href="requesterUrl"
          data-test="requester-url"
        >
          {{ requesterUrl }}
        </a>
      </h3>
    </form-field>
    <form-field v-if="message">
      <message>
        {{ message }}
      </message>
    </form-field>
    <form-field>
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
    </form-field>
    <form-controls>
      <v-button
        :disabled="isLoading || !isFormValid"
        type="submit"
        size="big"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
      <v-button
        v-if="withLogoutBtn"
        :disabled="isLoading"
        skin="error"
        size="big"
        data-test="logout-button"
        @click="emitLogout"
      >
        {{ $t('global.logout') }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import formMixin from '@/mixins/form';

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
    FormField,
    FormControls,
  },
};
</script>
