<template>
  <form @submit.prevent="onSubmit">
    <v-title>
      <span v-html="$t('components.createPassword.title')" />
    </v-title>
    <v-description>
      <span v-html="$t('components.createPassword.description', { email })" />
    </v-description>

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
        :placeholder="$t('components.createPassword.newPassword')"
        data-test="password-input"
      />
    </form-item>
    <form-item>
      <v-input
        v-model="repeatPassword"
        v-validate="'required|min:8'"
        type="password"
        required
        data-vv-as="password"
        data-vv-name="repeatPassword"
        :error="errors.first('repeatPassword')"
        name="repeatPassword"
        :placeholder="$t('components.createPassword.repeatPassword')"
        data-test="repeat-password-input"
      />
    </form-item>
    <form-item class="v-mb-24">
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code')"
        name="code"
        :label="$t('components.createPassword.labelCode')"
        :placeholder="$t('components.createPassword.placeholderCode')"
        data-test="password-input"
      />
    </form-item>
    <form-row>
      <form-controls>
        <v-button
          :disabled="!isSubmitEnable"
          type="submit"
          size="big"
          data-test="submit-button"
        >
          {{ $t('global.confirm') }}
        </v-button>
      </form-controls>
    </form-row>
  </form>
</template>

<script>
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import FormItem from '@/components/common/FormItem';
import formMixin from '@/mixins/form';
import { authStore } from '@/store';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';
import FormControls from '@/components/common/FormControls';
import FormRow from '@/components/common/FormRow';

export default {
  name: 'PasswordForm',

  authStore,

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    password: '',
    repeatPassword: '',
    code: '',
  }),

  computed: {
    isSubmitEnable() {
      return this.isFormValid && this.isPasswordEqual;
    },

    isPasswordEqual() {
      return this.password && this.password === this.repeatPassword;
    },
  },

  methods: {
    async onSubmit() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.$validator.errors.removeById('sendCodeId');
        await this.$options.authStore.confirmResetRegularPassword({
          password: this.password,
          code: this.code,
        });
        this.$emit('submit', this.password);
      } catch (error) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.createPassword.confirmError'),
          id: 'sendCodeId',
        });
      } finally {
        this.isLoading = false;
      }
    },
  },

  async mounted() {
    try {
      this.isLoading = true;
      this.$validator.errors.removeById('sendCodeId');
      await this.$options.authStore.resetRegularPassword({ email: this.email });
    } catch (e) {
      this.$validator.errors.add({
        field: 'code',
        msg: this.$i18n.t('components.createPassword.sendError'),
        id: 'sendCodeId',
      });
    } finally {
      this.isLoading = false;
    }
  },

  mixins: [formMixin],

  components: {
    VButton,
    FormRow,
    FormControls,
    VTitle,
    VDescription,
    VInput,
    FormItem,
  },
};
</script>

<style lang="postcss"></style>
