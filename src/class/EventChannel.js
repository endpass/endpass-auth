import pipe from 'callbag-pipe';
import filter from 'callbag-filter';
import toAsyncIterable from 'callbag-to-async-iterable';
import fromEventPattern from 'callbag-from-event-pattern';
import eventsService from '@/service/events';

export default class EventChannel {
  eventsIterator = null;

  handlers = [];

  /**
   * @param {string} mask of event type, `*:*:created` for example
   * @param {string} eventType
   * @return {boolean}
   */
  static isEventMatch(mask, eventType) {
    if (mask === eventType) {
      return true;
    }

    const regStr = mask.split('*').join('(.*)');
    const reg = new RegExp(regStr, 'i');
    return reg.test(eventType);
  }

  async initEvents() {
    this.eventsIterator = eventsService.getUserEventsIterator();
    for await (const data of this.eventsIterator) {
      this.handlers.forEach(handler => {
        handler(data);
      });
    }
  }

  stopEvents() {
    if (!this.eventsIterator) {
      return;
    }
    this.eventsIterator.return();
    this.eventsIterator = null;
  }

  /**
   * @param {string|string[]} eventTypes
   */
  getEventIterator(eventTypes) {
    const eventTypesList = [].concat(eventTypes);

    return pipe(
      fromEventPattern(
        handler => {
          this.handlers.push(handler);
        },
        handler => {
          const handlerIdx = this.handlers.indexOf(handler);
          if (handlerIdx !== -1) {
            this.handlers.splice(handlerIdx, 1);
          }
        },
      ),
      filter(data => {
        const { eventType } = data;
        return eventTypesList.some(checkEventType => {
          return EventChannel.isEventMatch(checkEventType, eventType);
        });
      }),
      toAsyncIterable,
    );
  }
}
