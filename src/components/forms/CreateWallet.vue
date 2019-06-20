<template>
  <div>
    <div v-if="!isShowSeed">
      <form
        data-test="define-pwd-form"
        @submit.prevent="onCreateWallet"
      >
        <form-field label="Please choose password:">
          <v-input
            v-model="password"
            :autofocus="true"
            type="password"
            placeholder="Enter password..."
          />
        </form-field>
        <form-field>
          <v-input
            v-model="passwordConfirm"
            :autofocus="true"
            type="password"
            placeholder="Confirm password..."
          />
        </form-field>
        <message
          v-if="error"
          :error="true"
          data-test="create-wallet-error"
        >
          {{ error }}
        </message>
        <form-controls>
          <v-button
            :disabled="!canSubmit"
            :submit="true"
            type="primary"
            data-test="submit-button"
            @click="onCreateWallet"
          >
            {{ primaryButtonLabel }}
          </v-button>
        </form-controls>
      </form>
    </div>
    <div v-else>
      <div class="box">
        <p>Your wallet recovery phrase</p>
        <br>
        <p
          class="code"
          data-test="seed-phrase"
        >
          {{ seedKey }}
        </p>
      </div>
      <v-button @click="onContinue">
        Continue
      </v-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormControls from '@/components/common/FormControls.vue';
import VInput from '@/components/common/VInput.vue';
import FormField from '@/components/common/FormField.vue';

export default {
  name: 'CreateWalletForm',

  data: () => ({
    email: '',
    error: '',
    passwordConfirm: '',
    password: '',
    seedKey: null,
    isLoading: false,
  }),

  computed: {
    canSubmit() {
      return this.isPasswordEqual && !this.isLoading;
    },
    isPasswordEqual() {
      return this.password && this.password === this.passwordConfirm;
    },
    primaryButtonLabel() {
      return this.isLoading ? 'Loading...' : 'Create Wallet';
    },
  },

  methods: {
    ...mapActions(['createWallet', 'setWalletCreated']),
    async onCreateWallet() {
      if (this.isPasswordEqual) {
        this.isLoading = true;
        try {
          this.error = '';
          this.seedKey = await this.createWallet({ password: this.password });
        } catch (e) {
          console.error(e);
          this.error = 'Something broken, when trying to create new Wallet';
        }
        this.isLoading = false;
      }
    },
    onContinue() {
      this.setWalletCreated();
    },
  },

  mixins: [],

  components: {
    FormField,
    VInput,
    VButton,
    Message,
    FormControls,
  },
};
</script>
