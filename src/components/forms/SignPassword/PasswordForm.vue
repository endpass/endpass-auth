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
        v-model="password"
        autofocus="true"
        required="true"
        type="password"
        name="password"
        :label="passwordInputLabel"
        :placeholder="$t('components.passwordForm.enterWalletPassword')"
      />
    </form-field>
    <form-controls>
      <v-button
        :disabled="isLoading || !isFormValid"
        type="submit"
        class="button"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
      <v-button
        v-if="withLogoutBtn"
        :disabled="isLoading"
        skin="error"
        class="button"
        type="button"
        data-test="logout-button"
        @click="emitLogout"
      >
        {{ $t('global.logout') }}
      </v-button>
      <v-button
        :disabled="!closable || isLoading"
        skin="ghost"
        type="button"
        class="button"
        data-test="cancel-button"
        @click="emitCancel"
      >
        {{ $t('global.close') }}
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
import i18n from '@/locales/i18n';

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
  }),

  computed: {
    primaryButtonLabel() {
      return !this.isLoading
        ? i18n.t('global.apply')
        : i18n.t('global.loading');
    },

    passwordInputLabel() {
      if (this.email) {
        return i18n.t('components.passwordForm.passwordForEmail', {
          email: this.email,
        });
      }

      return i18n.t('components.passwordForm.walletPassword');
    },

    isFormValid() {
      return !!this.password;
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

  components: {
    VButton,
    VInput,
    Message,
    FormField,
    FormControls,
  },
};
</script>
