<template>
  <screen>
    <composite-auth-form
      :closable="false"
      :is-public="true"
      @authorize="handleAuthorize"
    />
  </screen>
</template>

<script>
import { mapMutations } from 'vuex';
import { queryParamsToObject } from '@/util/url';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';

export default {
  name: 'PublicAuth',

  data: () => ({
    params: {},
  }),

  methods: {
    ...mapMutations(['setAuthParams']),

    handleAuthorize() {
      const { redirectUrl } = this.params;

      if (redirectUrl) {
        const redirectRoute = decodeURIComponent(redirectUrl).replace(
          /^(https?:\/\/[a-z.]+(:\d+)?)/gm,
          '',
        );

        this.$router.replace(redirectRoute);
      }
    },
  },

  mounted() {
    const { search } = window.location;

    this.params = queryParamsToObject(search);

    if (this.params.redirectUrl) {
      this.setAuthParams({
        redirectUrl: decodeURIComponent(this.params.redirectUrl),
      });
    }
  },

  components: {
    Screen,
    CompositeAuthForm,
  },
};
</script>
