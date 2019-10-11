<template>
  <div>
    {{ $t('components.sendCode.didntGetCode') }}&nbsp;
    <v-link
      :disabled="isLoading"
      href="#"
      data-test="send-code"
      @click.prevent="sendCode"
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
    sendCode() {
      this.$emit('send');
    },
  },

  components: {
    VLink,
  },
};
</script>
