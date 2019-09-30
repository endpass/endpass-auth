<template>
  <form
    class="form-otp"
    @submit.prevent="onSubmit"
  >
    <message
      class="v-modal-card-title"
      data-test="form-message"
      v-html="$t('components.regularPasswordForm.title')"
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
    <form-row>
      <v-button
        :disabled="!isFormValid || isLoading"
        type="submit"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-row>
    <form-row>
      <v-link
        skin="small-gray"
        :disabled="isLoading"
        href="#"
        data-test="password-recover"
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
import Message from '@/components/common/Message.vue';
import formMixin from '@/mixins/form';
import { authStore, coreStore } from '@/store';
import VLink from '@/components/common/VLink';

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
        ? this.$i18n.t('global.confirm')
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
    VLink,
    VButton,
    VInput,
    Message,
    FormItem,
    FormRow,
  },
};
</script>

<style lang="postcss"></style>
