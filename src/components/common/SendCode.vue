<template>
  <div>
    {{ $t('components.sendCode.didntGetCode') }}&nbsp;
    <v-link
      :disabled="isLoading"
      href="#"
      data-test="send-code"
      @click.prevent="onClick"
    >
      {{ $t('components.sendCode.sendTitle') }}
    </v-link>
  </div>
</template>

<script>
import VLink from '@endpass/ui/kit/VLink';

export default {
  name: 'SendCode',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onClick() {
      this.$emit('click');
    },
  },

  components: {
    VLink,
  },
};
</script>
