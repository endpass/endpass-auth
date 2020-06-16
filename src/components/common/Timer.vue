<script>
import VueTimers from 'vue-timers/mixin';

export default {
  name: 'Timer',

  props: {
    duration: {
      type: Number,
      default: 0,
    },

    tickStep: {
      type: Number,
      default: 1000,
    },
  },

  data: () => ({
    tickCount: 0,
  }),

  methods: {
    onRequestTick() {
      this.tickCount += this.tickStep;
      if (this.duration <= this.tickCount) {
        this.$timer.stop('durationTimer');
        this.$emit('done');
      }

      this.$emit('tick', Math.floor(this.tickCount / this.tickStep));
    },
  },

  mounted() {
    this.timers.durationTimer.time = this.tickStep;

    if (this.duration) {
      this.$timer.start('durationTimer');
    }
  },

  mixins: [VueTimers],

  timers: {
    durationTimer: {
      repeat: true,
      autostart: false,
      time: 1000,
      callback() {
        this.onRequestTick();
      },
    },
  },

  render() {
    return this.$slots.default;
  },
};
</script>
