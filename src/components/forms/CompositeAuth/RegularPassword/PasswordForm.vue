<template>
  <form @submit.prevent="onSubmit">
    <v-title>
      <span v-html="$t('components.regularPasswordForm.title')" />
    </v-title>
    <form-item>
      <v-input
        v-model="password"
        v-validate="'required|min:8'"
        data-vv-as="password"
        data-vv-name="password"
        :error="errors.first('password')"
        name="password"
        type="password"
        :placeholder="$t('components.regularPasswordForm.placeholder')"
        data-test="password-input"
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
import VLink from '@endpass/ui/kit/VLink';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'PasswordForm',

  data: () => ({
    password: '',
  }),

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
