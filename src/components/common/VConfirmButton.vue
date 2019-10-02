<template>
  <v-button
    v-bind="$attrs"
    v-on="$listeners"
  >
    {{ primaryButtonLabel }}
  </v-button>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';

export default {
  name: 'VConfirmButton',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },

  computed: {
    primaryButtonLabel() {
      return !this.isLoading ? this.title : this.$i18n.t('global.loading');
    },
  },

  components: {
    VButton,
  },
};
</script>

<style lang="postcss"></style>
