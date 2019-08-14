<template>
  <screen>
    <v-frame :title="'Rate limit exceed!'" :loading="false" :closable="false">
      <div class="v-rate-limit-body" data-test="rate-limit-body">
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
import { mapState, mapMutations } from 'vuex';
import dateUtils from '@endpass/utils/date';
import Screen from '@/components/common/Screen';
import VFrame from '@/components/common/VFrame';

export default {
  name: 'RateLimit',

  computed: {
    ...mapState({
      rateLimitTimeout: state => state.core.rateLimitTimeout,
    }),

    viewTimeout() {
      return dateUtils.formateDate(
        new Date(this.rateLimitTimeout * 1000),
        'ss',
      );
    },
  },

  methods: {
    ...mapMutations(['setRateLimitTimeout']),

    onTime() {
      const newTime = this.rateLimitTimeout - 1;

      if (newTime >= 0) {
        this.setRateLimitTimeout(newTime);
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
