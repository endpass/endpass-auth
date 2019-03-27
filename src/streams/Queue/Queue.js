import QueueAsync from '@endpass/class/QueueAsync';
import itemStates from './itemStates';

export default class Queue {
  constructor(options) {
    this.middleware = options.middleware || [];

    // Setup net requests queue
    this.queue = new QueueAsync();

    this.initRequestHandlerLoop();
  }

  /**
   * Handle requests from the queue using middleware
   * @private
   */
  async initRequestHandlerLoop() {
    const { queue } = this;

    // eslint-disable-next-line no-restricted-syntax
    for await (const action of queue) {
      try {
        const { middleware } = this;
        // let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const fn of middleware) {
          // console.log(`[${index}] ${fn.name}`);

          // eslint-disable-next-line no-await-in-loop
          await fn(action.options, action);
          // index++;
          if (action.state === itemStates.END) {
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  handleRequest(options, payload, req) {
    const queueItem = {
      /* eslint-disable-next-line */
      options,
      state: itemStates.INITIAL,
      payload,
      req,
      result: undefined,
      end() {
        this.setState(itemStates.END);
      },
      setState(state) {
        this.state = state;
      },
      setResult(val) {
        this.result = val;
      },
    };

    this.queue.put(queueItem);
  }
}
