// @ts-check
import generators from '@endpass/utils/generators';

const DEFAULT_TOTAL_TIME = 20 * 1000; // 20 sec
const DEFAULT_TIMER_PROGRESS = 1000;
const MAX_PROGRESS = 100;

const INCREMENT_EDGE = 0.4;
const EDGE_LIMIT = MAX_PROGRESS * 0.8;

export default class ProgressTimer {
  constructor() {
    this.progress = 0;
    this.isIncrement = false;
    /**
     * @type {Function[]}
     */
    this.callbacks = [];
    this.min = 0;
    this.max = 100;
  }

  /**
   * @private
   * @param {number} totalTime milliseconds for the whole timer
   * @return {Promise<void>}
   */
  async initRepeat(totalTime) {
    const perSecondIncrement = MAX_PROGRESS / (totalTime / 1000);
    // eslint-disable-next-line no-unused-vars
    for await (const index of generators.repeatWithInterval(
      DEFAULT_TIMER_PROGRESS,
    )) {
      const val = this.progress;
      const nextValue =
        val < EDGE_LIMIT ? val + perSecondIncrement : val + INCREMENT_EDGE;

      if (nextValue >= MAX_PROGRESS || !this.isIncrement) {
        this.setProgress(MAX_PROGRESS);
        break;
      }
      this.setProgress(nextValue);
    }
  }

  /**
   * @param {number} totalTime milliseconds for the whole timer
   * start timer progress
   */
  startProgress(totalTime = DEFAULT_TOTAL_TIME) {
    this.setRange(0, MAX_PROGRESS);
    this.progress = 0;
    this.isIncrement = true;
    this.initRepeat(totalTime);
  }

  /**
   * @param {number} value
   */
  setProgress(value) {
    const scaledValued = (value * (this.max - this.min)) / MAX_PROGRESS;
    const nextValue = this.min + scaledValued;

    const currValue = this.progress;
    if (nextValue < currValue) {
      return;
    }
    this.progress = nextValue >= MAX_PROGRESS ? MAX_PROGRESS : nextValue;
    this.onCallbacks();
  }

  onCallbacks() {
    this.callbacks.forEach(cb => {
      cb(this.progress);
    });
  }

  /**
   *
   * @param {number} min
   * @param {number} max
   */
  setRange(min, max) {
    this.min = min;
    this.max = max;
    this.setProgress(min);
  }

  /**
   * stop timer progress
   */
  fillAndStopProgress() {
    this.progress = MAX_PROGRESS;
    this.onCallbacks();
    this.isIncrement = false;
  }

  /**
   * @param {Function} cb
   */
  on(cb) {
    this.callbacks.push(cb);
  }

  /**
   * @param {Function=} [cb]
   */
  off(cb) {
    if (!cb) {
      this.callbacks = [];
      return;
    }
    this.callbacks = this.callbacks.filter(storedCb => storedCb !== cb);
  }
}
