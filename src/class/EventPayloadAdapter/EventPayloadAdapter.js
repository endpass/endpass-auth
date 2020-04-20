// TODO: add adapters for some events
import BaseAdapter from './adapters/BaseAdapter';

const adaptersByEventType = {};

export default class EventPayloadAdapter {
  static getAdapterByEvent(eventType) {
    if (adaptersByEventType[eventType]) {
      return adaptersByEventType[eventType];
    }

    return BaseAdapter;
  }
}
