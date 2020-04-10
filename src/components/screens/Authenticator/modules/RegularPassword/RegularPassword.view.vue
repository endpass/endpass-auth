<template>
  <form
    data-test="regular-password-form"
    @submit.prevent="onSubmit"
  >
    <v-title>
      {{ $t('components.regularPasswordForm.title') }}
    </v-title>
    <form-item>
      <v-input
        v-validate="'required|min:8'"
        :value="password"
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password')"
        name="password"
        type="password"
        required
        :placeholder="$t('components.regularPasswordForm.placeholder')"
        data-test="password-input"
        @input="onPassword"
      />
    </form-item>
    <form-item class="v-mb-24">
      <v-button
        :disabled="!isFormValid"
        type="submit"
        data-test="submit-button"
      >
        {{ $i18n.t('global.login') }}
      </v-button>
    </form-item>
    <form-row class="v-fs-14 v-text-center">
      <v-link
        role="button"
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
import VLink from '@endpass/ui/kit/VLink';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'RegularPasswordView',

  props: {
    password: {
      type: String,
      required: true,
    },

    error: {
      type: String,
      default: '',
    },
  },

  watch: {
    error: {
      handler(msg) {
        this.$validator.errors.removeById('passwordId');

        if (!msg) return;

        this.$validator.errors.add({
          id: 'passwordId',
          field: 'password',
          msg,
        });
      },
      immediate: true,
    },
  },

  methods: {
    onSubmit() {
      this.$emit('submit', {
        password: this.password,
      });
    },

    onRecover() {
      this.$emit('recover');
    },

    onPassword(password) {
      this.$emit('update:password', password);
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
