import DataEventSource from '@endpass/class/DataEventSource';
import map from 'callbag-map';
import pipe from 'callbag-pipe';
import toAsyncIterable from 'callbag-to-async-iterable';
import fromEventPattern from 'callbag-from-event-pattern';
import EventPayloadAdapter from '@/class/EventPayloadAdapter';

const url = `${ENV.VUE_APP_IDENTITY_API_URL}/events`;

const dataEventSource = new DataEventSource(url);

const getUserEventsIterator = () =>
  pipe(
    fromEventPattern(dataEventSource.addHandler, dataEventSource.removeHandler),
    map(({ data }) => JSON.parse(data)),
    map(({ eventType, payload, ...rawData }) => {
      const adapter = EventPayloadAdapter.getAdapterByEvent(eventType);
      return {
        ...rawData,
        eventType,
        payload: adapter.adapt(payload),
      };
    }),
    toAsyncIterable,
  );

export default {
  getUserEventsIterator,
};
