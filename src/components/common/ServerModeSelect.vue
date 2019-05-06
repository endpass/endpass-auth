<template>
  <div class="container">
    <message>
      Identity server
    </message>

    <form-field>
      <v-select
        :disabled="!isInputAllowed"
        :options="availableIdentityServerTypes"
        :items="availableIdentityServerTypes"
        v-model="currentIdentityServerType"
        :value="currentIdentityServerType"
        label="Identity Server"
        name="currentIdentityServerType"
        data-test="mode-select"
      />
    </form-field>

    <form-field v-if="isCustomMode">
      <v-input
        id="customIdentityServer"
        key="custom-identity-server"
        v-model="customIdentityServer"
        :disabled="!isInputAllowed"
        label="Custom Identity Server"
        data-vv-name="customIdentityServer"
        name="customIdentityServer"
        placeholder="Custom Identity Server"
        help="Example: https://yourserver.com/api"
        data-test="custom-server-input"
      />
      <message>
        Example: https://yourserver.com/api
      </message>
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
      type="primary"
      data-test="submit-button"
      @click="handleSubmit"
    >
      Confirm
    </v-button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import { IDENTITY_MODE } from '@/constants';
import VSelect from '@/components/common/VSelect.vue';
import VInput from '@/components/common/VInput.vue';
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';

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
  components: {
    VSelect,
    VInput,
    VButton,
    FormField,
    Message,
  },
  // mixins: [error, formMixin],
};
</script>

<style lang="postcss">
.container {
  width: 100%;
}
</style>
