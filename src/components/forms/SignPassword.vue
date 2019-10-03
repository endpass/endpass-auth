<template>
  <form
    data-test="sign-form"
    @submit.prevent="onSubmit"
  >
    <v-title v-if="requesterUrl">
      <span v-html="$t('components.passwordForm.applyConnectTo')" />
      <v-link
        :href="requesterUrl"
        data-test="requester-url"
        target="_blank"
        class="password-form-request-url v-fs-16"
        is-underline
      >
        {{ requesterUrl }}
      </v-link>
    </v-title>
    <form-item v-if="message">
      <message>
        {{ message }}
      </message>
    </form-item>
    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        data-vv-as="Password"
        data-vv-name="password"
        required
        type="password"
        name="password"
        :error="errors.first('password') || errorTitle"
        :label="passwordInputLabel"
        :placeholder="$t('components.passwordForm.enterPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-controls>
      <v-button
        v-if="withLogoutBtn"
        :disabled="isLoading"
        skin="error"
        type="button"
        size="big"
        data-test="logout-button"
        @click="onLogout"
      >
        {{ $t('global.logout') }}
      </v-button>
      <v-button
        :disabled="isLoading || !isFormValid"
        :is-loading="isLoading"
        size="big"
        data-test="submit-button"
      >
        {{ $t('global.apply') }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import VLink from '@endpass/ui/kit/VLink';
import Message from '@/components/common/Message';
import formMixin from '@/mixins/form';
import FormItem from '@/components/common/FormItem';
import VTitle from '@/components/common/VTitle';
import { coreStore } from '@/store';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'SignPasswordForm',

  coreStore,

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

    passwordInputLabel() {
      if (this.email) {
        return this.$i18n.t('components.passwordForm.passwordForEmail', {
          email: this.email,
        });
      }

      return this.$i18n.t('components.passwordForm.regularPassword');
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
    onSubmit() {
      if (!this.isFormValid || this.isLoading) return;

      this.$emit('submit', this.password);
    },

    onLogout() {
      this.$options.coreStore.logout();
      this.$emit('cancel');
    },
  },

  mixins: [formMixin],

  components: {
    FormControls,
    VTitle,
    VLink,
    VButton,
    VInput,
    Message,
    FormItem,
  },
};
</script>
<style lang="postcss">
.password-form-request-url {
  font-weight: normal;
  display: block;
}
</style>
