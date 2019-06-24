<template>
  <div class="container">
    <message>
      {{ $t('components.serverModeSelect.identityServer') }}
    </message>

    <form-field>
      <v-content-switcher
        v-model="currentIdentityServerType"
        :items="availableIdentityServerTypes"
        :disabled="!isInputAllowed"
        data-test="mode-select"
      />
    </form-field>

    <form-field v-if="isCustomMode">
      <v-input
        id="customIdentityServer"
        key="custom-identity-server"
        v-model="customIdentityServer"
        v-validate="'required|url'"
        :error="errors.first('customIdentityServer')"
        :disabled="!isInputAllowed"
        :label="$t('components.serverModeSelect.customIdentityServer')"
        data-vv-as="customIdentityServer"
        data-vv-name="customIdentityServer"
        name="customIdentityServer"
        :placeholder="$t('components.serverModeSelect.customIdentityServer')"
        :description="serverModeSelectExample"
        data-test="custom-server-input"
      />
    </form-field>

    <form-field v-if="validationError">
      <message
        :error="true"
        data-test="error-validation-message"
      >
        {{ validationError }}
      </message>
    </form-field>

    <v-button
      v-if="!isDefaultMode"
      :disabled="!isFormValid"
      type="button"
      data-test="submit-button"
      @click="handleSubmit"
    >
      {{ $t('global.confirm') }}
    </v-button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { IDENTITY_MODE } from '@/constants';
import VInput from '@endpass/ui/kit/VInput';
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import VContentSwitcher from '@endpass/ui/kit/VContentSwitcher';
import formMixin from '@/mixins/form';
import i18n from '@/locales/i18n';

const availableIdentityServerTypes = [
  {
    text: 'Endpass',
    val: IDENTITY_MODE.DEFAULT,
    value: IDENTITY_MODE.DEFAULT,
    label: 'Endpass',
  },
  {
    text: 'Local Storage',
    val: IDENTITY_MODE.LOCAL,
    value: IDENTITY_MODE.LOCAL,
    label: 'Local Storage',
  },
  {
    text: 'Custom server',
    val: IDENTITY_MODE.CUSTOM,
    value: IDENTITY_MODE.CUSTOM,
    label: 'Custom server',
  },
].filter(
  mode => !(ENV.VUE_APP_IS_PRODUCTION && mode.val === IDENTITY_MODE.LOCAL),
);

export default {
  name: 'ServerModeSelect',
  data: () => ({
    availableIdentityServerTypes,
    currentIdentityServerType: availableIdentityServerTypes[0].val,
    customIdentityServer: undefined,
    isValidating: false,
    validationError: '',
  }),
  computed: {
    ...mapState({
      isLoading: state => state.core.loading,
    }),
    serverModeSelectExample() {
      return `${i18n.t(
        'components.serverModeSelect.example',
      )}: https://yourserver.com/api`;
    },
    isInputAllowed() {
      return !this.isLoading && !this.isValidating;
    },

    isDefaultMode() {
      return this.currentIdentityServerType === IDENTITY_MODE.DEFAULT;
    },

    isLocalMode() {
      return this.currentIdentityServerType === IDENTITY_MODE.LOCAL;
    },

    isCustomMode() {
      return this.currentIdentityServerType === IDENTITY_MODE.CUSTOM;
    },

    isServerUrlValid() {
      const regexp = new RegExp(
        // eslint-disable-next-line
        /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g,
      );
      const { customIdentityServer } = this;

      return !!(customIdentityServer && regexp.test(customIdentityServer));
    },

    isFormValid() {
      const {
        isCustomMode,
        isLocalMode,
        isServerUrlValid,
        isInputAllowed,
        validationError,
      } = this;
      const isCustomValid = isCustomMode && isServerUrlValid;

      return (
        (isCustomValid || isLocalMode) && !validationError && isInputAllowed
      );
    },
  },
  watch: {
    currentIdentityServerType: {
      handler() {
        this.handleChange();
      },
      immediate: true,
    },
    customIdentityServer() {
      this.handleChange();
    },
  },
  methods: {
    ...mapActions(['validateCustomServer']),
    async validateServer(serverUrl) {
      this.isValidating = true;

      try {
        await this.validateCustomServer(serverUrl);
      } catch (e) {
        this.validationError = e.message;
        throw e;
      } finally {
        this.isValidating = false;
      }
    },

    async handleSubmit() {
      try {
        // TODO activate login statistic
        // this.$ga.event({
        //   eventCategory: 'onboarding',
        //   eventAction: 'submit_email',
        // });
        let serverUrl;

        if (this.isCustomMode) {
          serverUrl = this.customIdentityServer.replace(/\/+$/, '');

          await this.validateServer(serverUrl);
        }

        const mode = {
          type: this.currentIdentityServerType,
          serverUrl,
        };

        this.$emit('input', mode);
        this.$emit('confirm');
      } catch (e) {}
    },

    handleClose() {
      this.$emit('close');
    },

    handleChange() {
      this.validationError = '';
      this.$emit('update:isCustomServerValid', this.isServerUrlValid);

      this.$emit('input', {
        type: this.currentIdentityServerType,
        serverUrl: this.customIdentityServer,
      });
    },
  },
  mixins: [formMixin],
  components: {
    VInput,
    VButton,
    FormField,
    Message,
    VContentSwitcher,
  },
  // mixins: [error, formMixin],
};
</script>

<style lang="postcss">
.container {
  width: 100%;
}
</style>
