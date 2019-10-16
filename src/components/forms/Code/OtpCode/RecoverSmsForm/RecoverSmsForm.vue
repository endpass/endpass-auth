<template>
  <loading-screen :is-loading="isLoading">
    <form
      v-if="isPhoneExist"
      data-test="recover-otp"
      @submit.prevent="onSubmit"
    >
      <v-title>
        <span v-html="$t('components.recoverOtpSms.title')" />
      </v-title>

      <form-item>
        <v-input
          v-model="code"
          v-validate="'required|digits:6'"
          data-vv-as="code"
          data-vv-name="code"
          :error="errors.first('code')"
          name="code"
          :placeholder="$t('components.otp.enterReceivedCode')"
          data-test="code-input"
        />
      </form-item>
      <form-item class="v-mb-24">
        <form-controls>
          <v-button
            :disabled="isLoading"
            skin="quaternary"
            data-test="cancel-button"
            @click="onCancel"
          >
            {{ $t('global.cancel') }}
          </v-button>
          <v-button
            :disabled="!isFormValid || isLoading"
            :is-loading="isLoading"
            type="submit"
            data-test="submit-button"
          >
            {{ $t('global.confirm') }}
          </v-button>
        </form-controls>
      </form-item>
      <form-row class="v-fs-14 v-text-center">
        <v-link
          :disabled="isLoading"
          href="#"
          data-test="recovery-link"
          @click.prevent="sendRecoverSms"
        >
          {{ $t('components.recoverOtpSms.sendTitle') }}
        </v-link>
      </form-row>
    </form>
    <form
      v-else
      data-test="phone-not-exist"
      @submit.prevent="onCancel"
    >
      <v-title>
        <span v-html="$t('components.recoverOtpSms.titlePhoneNotExist')" />
      </v-title>

      <form-item class="v-mb-24">
        <v-button
          :is-loading="isLoading"
          type="submit"
          data-test="submit-button"
        >
          {{ $t('global.cancel') }}
        </v-button>
      </form-item>
    </form>
  </loading-screen>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import VInput from '@endpass/ui/kit/VInput';
import VLink from '@endpass/ui/kit/VLink';
import { authStore } from '@/store';
import createRecoverController from './RecoverController';
import FormItem from '@/components/common/FormItem';
import FormRow from '@/components/common/FormRow';
import FormControls from '@/components/common/FormControls';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'RecoverSmsForm',

  authStore,
  recoverController: createRecoverController(),

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isPhoneExist: true,
    code: '',
    isLoading: false,
  }),

  methods: {
    async sendRecoverSms() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.$validator.errors.removeById('sendCodeId');
        const { email } = this;

        await this.$options.recoverController.sendSms({ email });
      } catch (error) {
        if (error.code === 400) {
          this.isPhoneExist = false;
          return;
        }

        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.recoverOtpSms.sendSmsError'),
          id: 'sendCodeId',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async onSubmit() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.$validator.errors.removeById('sendCodeId');
        const { code, email } = this;

        await this.$options.recoverController.disableOtp({
          email,
          code,
        });
      } catch (err) {
        this.$validator.errors.add({
          field: 'code',
          msg: this.$i18n.t('components.recoverOtpSms.recoverError'),
          id: 'sendCodeId',
        });
      } finally {
        this.isLoading = false;
      }
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  mounted() {
    this.sendRecoverSms();
  },

  mixins: [formMixin],

  components: {
    VTitle,
    VLink,
    VButton,
    VInput,
    FormItem,
    FormRow,
    FormControls,
    LoadingScreen,
  },
};
</script>

<style lang="postcss"></style>
