<template>
  <screen @close="handleWindowClose">
    <composite-auth-form :closable="isDialog" @authorize="handleAuthorize" />
  </screen>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';

export default {
  name: 'Auth',

  computed: {
    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions(['confirmAuth', 'cancelAuth', 'dialogClose']),

    handleWindowClose() {
      this.cancelAuth();
      this.dialogClose();
    },

    handleAuthorize({ serverMode }) {
      this.confirmAuth(serverMode);
    },
  },

  components: {
    Screen,
    CompositeAuthForm,
  },
};
</script>
