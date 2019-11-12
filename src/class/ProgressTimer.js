// @ts-check

const DEFAULT_TOTAL_TIME = 20 * 1000;
const DEFAULT_TIMER_PROGRESS = 1000;
const MAX_PROGRESS = 100;

const INCREMENT_EDGE = 0.4;
const EDGE_LIMIT = MAX_PROGRESS * 0.8;

/**
 * @typedef { (progress: number) => any } Callback
 */

export default class ProgressTimer {
  /**
   * @param {number=} [totalTime]
   */
  constructor(totalTime = DEFAULT_TOTAL_TIME) {
    this.totalTime = totalTime;

    /**
     * @private
     * @type {number}
     */
    this.progress = 0;
    this.perStepIncrement = 0;

    this.intervalId = undefined;

    /**
     * @type {Callback[]}
     */
    this.callbacks = [];

    this.min = 0;
    this.max = MAX_PROGRESS;
  }

  /**
   * @private
   */
  onInterval = () => {
    const val = this.progress;
    const nextValue =
      val < EDGE_LIMIT ? val + this.perStepIncrement : val + INCREMENT_EDGE;

    if (nextValue >= MAX_PROGRESS) {
      this.fillAndStopProgress();
      return;
    }
    this.setProgress(nextValue);
  };

  /**
   *
   * @param {number=} [min] minimum range value
   * @param {number=} [max] maximum range value
   * @param {number=} [totalTime] milliseconds for the whole timer
   * start timer progress
   */
  startProgress(min = 0, max = MAX_PROGRESS, totalTime = this.totalTime) {
    window.clearInterval(this.intervalId);
    this.progress = 0;
    this.perStepIncrement = MAX_PROGRESS / (totalTime / 1000);
    this.setRange(0, max);
    this.continueProgress(min, max);
  }

  /**
   * @param {number=} [min] minimum range value
   * @param {number=} [max] maximum range value
   */
  continueProgress(min = 0, max = MAX_PROGRESS) {
    if (min < this.min) {
      throw new Error(`Progress range min value can't be less than it was`);
    }
    this.setRange(min, max);
    this.setProgress(0);
    window.clearInterval(this.intervalId);
    this.intervalId = window.setInterval(
      this.onInterval,
      DEFAULT_TIMER_PROGRESS,
    );
  }

  /**
   * @param {number} value
   */
  setProgress(value) {
    this.progress = value >= MAX_PROGRESS ? MAX_PROGRESS : value;
    this.notifyObservers();
  }

  get progressRange() {
    const scaledValued = (this.progress * (this.max - this.min)) / MAX_PROGRESS;
    const nextValue = this.min + scaledValued;
    return nextValue >= this.max ? this.max : nextValue;
  }

  /**
   * @private
   */
  notifyObservers() {
    this.callbacks.forEach(cb => cb(this.progressRange));
  }

  /**
   *
   * @param {number} min
   * @param {number} max
   */
  setRange(min, max) {
    this.min = min;
    if (min >= max) {
      throw new Error(`Max value can't be equal or more than min value`);
    }
    if (max > MAX_PROGRESS) {
      throw new Error(`Max value can't be more than ${MAX_PROGRESS}`);
    }
    this.max = max;
  }

  /**
   * stop timer progress
   */
  fillAndStopProgress() {
    window.clearInterval(this.intervalId);
    this.progress = MAX_PROGRESS;
    this.notifyObservers();
  }

  /**
   * @param {Callback} cb
   */
  on(cb) {
    this.callbacks.push(cb);
  }

  /**
   * @param {Callback} [cb]
   */
  off(cb) {
    this.callbacks = this.callbacks.filter(storedCb => storedCb !== cb);
  }
}
