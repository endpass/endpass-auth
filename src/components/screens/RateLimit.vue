<template>
  <screen>
    <v-frame
      :title="$t('components.rateLimit.title')"
      :is-loading="false"
      :is-closable="false"
    >
      <div
        class="v-rate-limit-body"
        data-test="rate-limit-body"
      >
        {{ $t('components.rateLimit.toMuch') }}
        <div class="v-rate-limit-timeout">
          {{ viewTimeout }}
        </div>
      </div>
    </v-frame>
  </screen>
</template>

<script>
import VueTimers from 'vue-timers/mixin';
import dateUtils from '@endpass/utils/date';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';
import { coreStore } from '@/store';

export default {
  name: 'RateLimit',

  computed: {
    rateLimitTimeout() {
      return coreStore.rateLimitTimeout;
    },

    viewTimeout() {
      return dateUtils.formateDate(
        new Date(this.rateLimitTimeout * 1000),
        'ss',
      );
    },
  },

  methods: {
    onTime() {
      const newTime = this.rateLimitTimeout - 1;

      if (newTime >= 0) {
        coreStore.setRateLimitTimeout(newTime);
      }
    },
  },

  mixins: [VueTimers],

  timers: {
    rateLimitTimer: {
      autostart: true,
      repeat: true,
      time: 1000,
      callback() {
        this.onTime();
      },
    },
  },

  components: {
    Screen,
    VFrame,
  },
};
</script>
<style type="postcss">
.v-rate-limit-body {
  text-align: center;
}
.v-rate-limit-timeout {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
}
</style>
