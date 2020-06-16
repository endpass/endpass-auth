<template>
  <div class="media-timer-view">
    <div class="media-timer-counter">
      <svg
        class="media-timer-svg"
        :width="`${$options.TIMER_SIZE}px`"
        :height="`${$options.TIMER_SIZE}px`"
        :viewbox="`0 0 ${$options.TIMER_SIZE} ${$options.TIMER_SIZE}`"
      >
        <path
          ref="loader"
          class="media-timer-loader"
          :transform="
            `translate(${$options.TIMER_SIZE / 2}, ${$options.TIMER_SIZE / 2})`
          "
        />
      </svg>
    </div>
    <span class="media-timer-title">
      {{ timerTitle }}
    </span>
  </div>
</template>

<script>
const HALF_PI = Math.PI / 180;

const TIMER_SIZE = 52;

export default {
  name: 'RecordTimerView',

  TIMER_SIZE,

  props: {
    countDown: {
      type: Number,
      required: true,
    },

    totalCount: {
      type: Number,
      required: true,
    },
  },

  computed: {
    timerTitle() {
      return `${this.countDown}s`;
    },
  },

  watch: {
    countDown() {
      this.drawPie();
    },
  },

  methods: {
    drawPie() {
      const { loader } = this.$refs;

      const seconds =
        ((this.totalCount - this.countDown) * 360) / this.totalCount;

      const a = seconds % 360;
      const r = a * HALF_PI;
      const x = Math.sin(r) * TIMER_SIZE;
      const y = Math.cos(r) * -TIMER_SIZE;
      const mid = a > 180 ? 1 : 0;
      const dValue = `M 0 0 v -${TIMER_SIZE} A ${TIMER_SIZE} ${TIMER_SIZE} 1 ${mid} 1 ${x} ${y} z`;

      loader.setAttribute('d', dValue);
    },
  },
};
</script>

<style lang="postcss">
.media-timer-view {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid var(--endpass-ui-color-white);
  box-sizing: border-box;
  color: var(--endpass-ui-color-white);
}

.media-timer-counter {
  position: absolute;
  left: 2px;
  top: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  width: 52px;
  height: 52px;
}

.media-timer-title {
  font-size: 20px;
  position: relative;
}

.media-timer-svg {
  flex: 1;
}

.media-timer-loader {
  fill: var(--endpass-ui-color-primary-7);
}
</style>
