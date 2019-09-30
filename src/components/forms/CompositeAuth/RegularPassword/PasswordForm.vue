<template>
  <form
    class="form-otp"
    @submit.prevent="onSubmit"
  >
    <v-title
      data-test="form-title"
      :html="$t('components.regularPasswordForm.title')"
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
        :placeholder="$t('components.regularPasswordForm.placeholder')"
        data-test="password-input"
      />
    </form-item>
    <form-item is-last>
      <v-button
        :disabled="!isFormValid || isLoading"
        type="submit"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-item>
    <form-row
      class="v-text-size-14"
      centered
    >
      <v-link
        :disabled="isLoading"
        href="#"
        data-test="password-recover"
        :underline="false"
        @click.prevent="onRecover"
      >
        {{ $i18n.t('components.regularPasswordForm.recover') }}
      </v-link>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import { authStore, coreStore } from '@/store';
import VLink from '@/components/common/VLink';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'PasswordForm',

  authStore,
  coreStore,

  props: {
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
        ? this.$i18n.t('global.login')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    onSubmit() {
      this.$emit('submit', this.password);
    },

    onRecover() {
      this.$emit('recover');
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
  },
};
</script>

<style lang="postcss"></style>
