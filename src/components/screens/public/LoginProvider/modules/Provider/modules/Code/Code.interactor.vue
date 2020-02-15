<template>
  <Code
    :challenge-type="challengeType"
    :is-loading.sync="isLoading"
    :error.sync="error"
    :email="email"
    @recover="onRecover"
    @submit="onSubmit"
  />
</template>

<script>
import Code from '@/components/modules/Code';
import createLoginController from './LoginController';

export default {
  name: 'CodeInteractor',

  loginController: createLoginController(),

  props: {
    challengeType: {
      type: String,
      required: true,
    },

    loginChallenge: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    error: '',
    isLoading: false,
  }),

  methods: {
    async onSubmit({ code }) {
      try {
        this.isLoading = true;
        this.error = '';
        const {
          redirect,
        } = await this.$options.loginController.authLoginChallenge({
          challengeId: this.loginChallenge,
          code,
        });
        this.$emit('complete', { redirect });
      } catch (e) {
        this.error = this.$i18n.t('components.loginProvider.notWorkingError');
      } finally {
        this.isLoading = false;
      }
    },

    onRecover() {
      this.$emit('recover');
    },
  },

  components: {
    Code,
  },
};
</script>
