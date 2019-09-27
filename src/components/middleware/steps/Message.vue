<template>
  <step-container @cancel="onCancel">
    <form-item>
      <message data-test="form-message">
        {{ message }}
      </message>
    </form-item>
    <v-button
      :disabled="!isDialog"
      data-test="cancel-button"
      @click="onCancel"
    >
      {{ $t('global.close') }}
    </v-button>
  </step-container>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import FormItem from '@/components/common/FormItem';
import StepContainer from '@/components/middleware/StepContainer';
import { coreStore, accountsStore } from '@/store';

export default {
  name: 'MessageForm',

  accountsStore,
  coreStore,

  data() {
    return {
      message: '',
    };
  },

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },
  },

  beforeMount() {
    if (this.$options.accountsStore.isLogin) {
      this.message = this.$i18n.t(
        'components.compositeAuth.successAuthMessage',
      );
    } else {
      this.message = this.$i18n.t('components.compositeAuth.linkSentMessage');
    }
    this.$emit('ready');
  },

  components: {
    StepContainer,
    VButton,
    Message,
    FormItem,
  },
};
</script>
