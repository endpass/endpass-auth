<template>
  <form
    class="form-otp"
    @submit.prevent="onSubmit"
  >
    <v-title
      data-test="form-title"
      :html="$t('components.otp.enterCode')"
    />

    <form-item>
      <v-input
        v-model="code"
        v-validate="'required|digits:6'"
        data-vv-as="code"
        data-vv-name="code"
        :error="errors.first('code') || error"
        name="code"
        :placeholder="$t('components.otp.enterReceivedCode')"
        data-test="code-input"
      />
    </form-item>
    <form-item>
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
        :underline="false"
        :disabled="isLoading"
        href="#"
        data-test="recovery-link"
        @click.prevent="emitRecoverEvent"
      >
        {{ $t('components.otp.noCode') }}
      </v-link>
    </form-row>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import { coreStore } from '@/store';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VLink from '@/components/common/VLink';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'OtpForm',

  coreStore,

  props: {
    error: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    code: '',
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
      this.$emit('submit', this.code);
    },

    emitRecoverEvent() {
      if (this.isLoading) return;

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
