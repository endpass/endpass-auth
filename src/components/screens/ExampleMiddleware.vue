<template>
  <screen @close="onCancel">
    <middleware-form
      :steps="steps"
      @end="onEnd"
      @cancel="onCancel"
    />
  </screen>
</template>

<script>
import Screen from '@/components/common/Screen';
import { coreStore, accountsStore } from '@/store';
import MiddlewareForm from '@/components/middleware/MiddlewareForm';

import MessageForm from '@/components/middleware/steps/Message';

export default {
  name: 'ExampleMiddleware',

  coreStore,
  accountsStore,

  data: () => ({
    steps: [MessageForm],
  }),

  methods: {
    onCancel() {
      // cancel logic, drop channel for example
      this.$options.accountsStore.cancelAllChannels();
      this.$options.coreStore.dialogClose();
    },
    onEnd() {
      this.$options.coreStore.dialogClose();
    },
  },

  components: {
    MiddlewareForm,
    Screen,
  },
};
</script>
