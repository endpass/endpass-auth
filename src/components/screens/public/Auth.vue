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
import Screen from '@/components/common/Screen';
import CompositeAuthForm from '@/components/forms/CompositeAuth';

export default {
  name: 'PublicAuth',

  methods: {
    handleAuthorize() {
      const { search } = window.location;

      this.$router.replace(`/login${search}`);
    },
  },

  components: {
    Screen,
    CompositeAuthForm,
  },
};
</script>
