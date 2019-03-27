<template>
  <screen @close="handleWindowClose">
    <v-frame :loading="false" :closable="isDialog" @close="handleSignCancel">
      <sign-form
        :loading="isLoading"
        :error="error"
        :closable="isDialog"
        @cancel="handleSignCancel"
        @submit="handleSignSubmit"
      />
    </v-frame>
  </screen>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import SignForm from '@/components/forms/SignHost';

export default {
  name: 'SignPermission',

  data: () => ({
    error: null,
    isLoading: false,
  }),

  computed: {
    ...mapState({
      inited: state => state.core.inited,
    }),
    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions([
      'signPermission',
      'cancelSignPermission',
      'cancelRequest',
      'dialogClose',
    ]),

    async handleSignSubmit(res) {
      this.isLoading = true;
      try {
        await this.signPermission({
          password: res.password,
        });

        this.error = null;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    handleSignCancel() {
      this.cancelSignPermission();
      this.dialogClose();
    },

    handleWindowClose() {
      this.cancelSignPermission();
      this.dialogClose();
    },
  },

  components: {
    Screen,
    SignForm,
    VFrame,
  },
};
</script>
