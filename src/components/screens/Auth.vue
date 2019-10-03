<template>
  <screen @close="onCancel">
    <v-modal-card
      :is-closable="isDialog"
      @close="onCancel"
    >
      <composite-auth-form
        :is-closable="isDialog"
        @cancel="onCancel"
        @authorize="onAuth"
      />
    </v-modal-card>
  </screen>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import { authStore, coreStore } from '@/store';

export default {
  name: 'Auth',

  authStore,
  coreStore,

  computed: {
    isDialog() {
      return this.$options.coreStore.isDialog;
    },
  },

  methods: {
    async onCancel() {
      this.$options.authStore.cancelAuth();
      this.$options.coreStore.dialogClose();
    },

    async onAuth({ serverMode } = {}) {
      this.$options.authStore.confirmAuth(serverMode);
    },
  },

  components: {
    Screen,
    VModalCard,
    CompositeAuthForm,
  },
};
</script>
