<template>
  <form
    class="form-otp"
    @submit.prevent="onSubmit"
  >
    <v-title>
      <span v-html="$t('components.otp.title')" />
    </v-title>
    <v-description>
      <span v-html="$t('components.otp.description')" />
    </v-description>

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
    <form-item class="v-mb-24">
      <v-button
        :disabled="!isFormValid || isLoading"
        type="submit"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-item>
    <form-row
      class="v-fs-14"
      centered
    >
      <v-link
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
import VLink from '@endpass/ui/kit/VLink';
import { authStore } from '@/store';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';

export default {
  name: 'OtpForm',

  authStore,

  props: {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    code: '',
    error: '',
    isLoading: false,
  }),

  computed: {
    primaryButtonLabel() {
      return !this.isLoading
        ? this.$i18n.t('global.confirm')
        : this.$i18n.t('global.loading');
    },
  },

  methods: {
    async onSubmit() {
      try {
        const { code, email, password } = this;
        this.isLoading = true;
        this.error = null;
        await this.$options.authStore.authByCode({
          email,
          password,
          code,
        });

        this.$emit('submit', code);
      } catch (err) {
        // TODO: add handling
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },

    emitRecoverEvent() {
      if (this.isLoading) return;

      this.$emit('recover');
    },
  },

  mixins: [formMixin],

  components: {
    VTitle,
    VDescription,
    VLink,
    VButton,
    VInput,
    FormItem,
    FormRow,
  },
};
</script>

<style lang="postcss"></style>
