<template>
  <screen @close="onCancel">
    <middleware-form
      :components="components"
      @end="onEnd"
      @cancel="onCancel"
    />
  </screen>
</template>

<script>
import Screen from '@/components/common/Screen';
import CreateWalletForm from '@/components/forms/CreateWallet';
import MiddlewareForm from '@/components/middleware/MiddlewareForm';
import MessageForm from '@/components/forms/Sign/MessageForm';
import Otp from '@/components/forms/Otp';
import Recover from '@/components/forms/Recover';
import Auth from '@/components/forms/Auth';

export default {
  name: 'Auth',

  data: () => ({
    components: [Otp, Recover, MessageForm, CreateWalletForm, Auth],
  }),

  methods: {
    onCancel() {
      // cancel logic, drop channel for example
      this.dialogClose();
    },
    onEnd() {
      this.dialogClose();
    },
  },

  components: {
    MiddlewareForm,
    Screen,
  },
};
</script>
