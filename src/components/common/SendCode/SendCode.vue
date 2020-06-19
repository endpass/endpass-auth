<template>
  <div>
    <component
      :is="codeLayout"
      :is-loading="isLoading"
      :counter="counter"
      @send-code="onSendCode"
    />
    <count-down-timer
      :duration="duration"
      :is-counting.sync="isLocked"
      :counter.sync="counter"
    />
  </div>
</template>

<script>
import CountLabelLayout from './layouts/CountLabel';
import RequestCodeLayout from './layouts/RequestCode';
import CountDownTimer from '@/components/common/CountDownTimer';

export default {
  name: 'SendCode',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    duration: {
      type: Number,
      default: 60000,
    },
  },

  data: () => ({
    counter: 0,
    isLocked: false,
  }),

  computed: {
    codeLayout() {
      if (this.isLocked) {
        return CountLabelLayout;
      }

      return RequestCodeLayout;
    },
  },

  methods: {
    onSendCode() {
      this.isLocked = true;
      this.$emit('send-code');
    },
  },

  components: {
    CountDownTimer,
  },
};
</script>
