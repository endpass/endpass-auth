<template>
  <div>
    <component
      :is="codeLayout"
      :is-loading="isLoading"
      :is-locked.sync="isLocked"
      :counter="counter"
      v-on="$listeners"
    />
    <count-down-timer
      :timeout="timeout"
      :is-locked.sync="isLocked"
      :counter.sync="counter"
    />
  </div>
</template>

<script>
import CodeRequestedLayout from './layouts/CodeRequested';
import RequestCodeLayout from './layouts/RequestCode';
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
        return CodeRequestedLayout;
      }

      return RequestCodeLayout;
    },
  },

  components: {
    CountDownTimer,
  },
};
</script>
