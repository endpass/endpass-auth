import VueTimers from 'vue-timers/mixin'; export default { name:
'CountDownTimer', props: { timeout: { type: Number, default: 30000, }, isLocked:
{ type: Boolean, default: false, }, counter: { type: Number, default: 0, }, },
watch: { isLocked(newValue) { if (!newValue) { if (this.isRequestTimerRunning) {
this.stopRequestTimer(); } return; } this.startRequestTimer(); }, }, computed: {
initialCounter() { return this.timeout / 1000; }, isRequestTimerRunning() {
return this.$timer.request.isRunning; }, }, methods: { startRequestTimer() {
this.$emit('update:is-locked', true); this.$emit('update:counter',
this.initialCounter); this.$timer.start('request'); }, stopRequestTimer() {
this.$emit('update:is-locked', false); this.$timer.stop('request'); },
onRequestTick() { if (this.counter === 0) { this.stopRequestTimer(); }
this.$emit('update:counter', this.counter - 1); }, }, mixins: [VueTimers],
timers: { request: { repeat: true, time: 1000, callback() {
this.onRequestTick(); }, }, }, };
