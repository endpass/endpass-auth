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
/* eslint-disable camelcase */

import { mapMutations } from 'vuex';
import queryStringToMap from '@endpass/utils/queryStringToMap';
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';

export default {
  name: 'PublicAuth',

  data: () => ({
    queryParamsMap: {},
  }),

  methods: {
    ...mapMutations(['setAuthParams']),

    handleAuthorize() {
      const { redirect_url } = this.queryParamsMap;

      if (redirect_url) {
        const fullPath = decodeURIComponent(redirect_url);

        const parser = document.createElement('a');
        parser.href = window.location;
        const { origin } = parser;

        const newPath = fullPath.replace(origin, '');

        // const redirectRoute = decodeURIComponent(redirectUrl).replace(
        //   /^(https?:\/\/[a-z.]+(:\d+)?)/gm,
        //   '',
        // );

        this.$router.replace(newPath);
        // this.$router.replace(redirectRoute);
      }
    },
  },

  mounted() {
    const { search } = window.location;

    this.queryParamsMap = queryStringToMap(search);

    if (this.queryParamsMap.redirect_url) {
      this.setAuthParams({
        redirectUrl: decodeURIComponent(this.queryParamsMap.redirect_url),
      });
    }
  },

  components: {
    Screen,
    CompositeAuthForm,
  },
};
</script>
