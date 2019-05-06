<template>
  <screen @close="handleWindowClose">
    <v-frame
      :loading="!request"
      :closable="isDialog"
      @close="handleSignCancel"
    >
      <sign-form
        :loading="loading"
        :request="request"
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
import SignForm from '@/components/forms/Sign';

export default {
  name: 'Sign',

  data: () => ({
    error: null,
  }),

  computed: {
    ...mapState({
      inited: state => state.core.inited,
      loading: state => state.core.loading,
      request: state => state.requests.request,
    }),
    ...mapGetters(['isDialog']),
  },

  methods: {
    ...mapActions(['processRequest', 'cancelRequest', 'dialogClose']),

    async handleSignSubmit(res) {
      try {
        await this.processRequest(res.password);
        this.error = null;
      } catch (err) {
        console.log(err);
        this.error = err.message;
      }
    },

    handleSignCancel() {
      this.cancelRequest();
      this.dialogClose();
    },

    handleWindowClose() {
      this.cancelRequest();
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
