<template>
  <div>
    <template v-if="isLocked">
      {{ label }}
    </template>
    <template v-else>
      {{ $t('components.sendCode.didntGetCode') }}&nbsp;
      <v-link
        :disabled="isCodeRequesting"
        href="#"
        data-test="send-code"
        @click.prevent="onClick"
      >
        {{ label }}
      </v-link>
    </template>
    <count-down-timer
      :timeout="timeout"
      :is-locked.sync="isLocked"
      :counter.sync="counter"
    />
  </div>
</template>

<script>
import VLink from '@endpass/ui/kit/VLink';
import { DEFAULT_SEND_CODE_TIMEOUT } from '@/constants';
import CountDownTimer from '@/components/common/CountDownTimer';

export default {
  name: 'SendCode',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    timeout: {
      type: Number,
      default: DEFAULT_SEND_CODE_TIMEOUT,
    },
  },

  data: () => ({
    counter: 0,
    isLocked: false,
  }),

  computed: {
    isCodeRequesting() {
      return this.isLoading || this.isLocked;
    },

    label() {
      if (this.isLocked) {
        return this.$t('components.sendCode.youCanRequestCodeAfter', {
          seconds: this.counter,
        });
      }

      return this.$t('components.sendCode.sendTitle');
    },
  },

  methods: {
    onClick() {
      this.isLocked = true;
      this.$emit('click');
    },
  },

  components: {
    VLink,
    CountDownTimer,
  },
};
</script>
