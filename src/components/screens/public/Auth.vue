<template>
  <screen>
    <v-frame
      :loading="!isInited"
      :closable="false"
      @close="handleAuthCancel"
    >
      <composite-auth-form
        :closable="false"
        :is-public="true"
        @authorize="handleAuthorize"
      />
    </v-frame>
  </screen>
</template>

<script>
/* eslint-disable camelcase */

import { mapMutations, mapState, mapActions } from 'vuex';
import queryStringToMap from '@endpass/utils/queryStringToMap';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import CompositeAuthForm from '@/components/forms/CompositeAuth';
import { parseUrl } from '@/util/dom';

export default {
  name: 'PublicAuth',

  data: () => ({
    queryParamsMap: {},
  }),

  methods: {
    ...mapMutations(['setAuthParams']),
    ...mapState({
      isInited: state => state.core.isInited,
    }),
    ...mapActions(['cancelAuth', 'dialogClose']),

    handleAuthorize() {
      const { redirect_url } = this.queryParamsMap;

      if (redirect_url) {
        const fullPath = decodeURIComponent(redirect_url);

        const { origin } = parseUrl(fullPath);

        const newPath = fullPath.replace(origin, '');

        // const redirectRoute = decodeURIComponent(redirectUrl).replace(
        //   /^(https?:\/\/[a-z.]+(:\d+)?)/gm,
        //   '',
        // );

        this.$router.replace(newPath);
        // this.$router.replace(redirectRoute);
      }
    },

    handleAuthCancel() {
      this.cancelAuth();
      this.dialogClose();
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
    VFrame,
    CompositeAuthForm,
  },
};
</script>
