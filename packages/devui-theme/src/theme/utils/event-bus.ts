import { IEventBus } from './interface';

export class EventBus implements IEventBus {
  private eventBusCore = [];
  // @ts-ignore
  private areFuncEqual(a, b) {
    return a.toString() === b.toString();
  }
  // @ts-ignore
  private isKeyValueObjInArr(arr, key, val) {
    // @ts-ignore
    const filteredArr = arr.filter(entry => {
      return entry[key] === val;
    });
    return filteredArr.length > 0;
  }
  // @ts-ignore
  private removeFuncInFuncArr(arr, fn) {
    for (let z = 0; z < arr.length; z++) {
      if (this.areFuncEqual(arr[z], fn)) {
        arr.splice(z, 1);
      }
    }
    return arr;
  }
  // @ts-ignore
  private getKeyValueObjInArr(arr, key, val) {
    // @ts-ignore
    const filteredArr = arr.filter(entry => {
      return entry[key] === val;
    });
    return filteredArr[0];
  }
  // @ts-ignore
  private addEvent(eventName, eventFunc) {
    if (!this.isKeyValueObjInArr(this.eventBusCore, 'eventName', eventName)) {
      // @ts-ignore
      this.eventBusCore.push({ eventName: eventName, eventFuncArr: [eventFunc] });
    } else {
      this.eventBusCore = this.eventBusCore.map(event => {
        if (event['eventName'] === eventName) {
          // @ts-ignore
          event.eventFuncArr.push(eventFunc);
        }
        return event;
      });
    }
  }
  // @ts-ignore
  public add(eventName, callbacks) {
    if (!eventName) {
      return;
    }
    if (typeof callbacks === 'function') {
      for (let i = 1; i < arguments.length; i++) {
        this.addEvent(eventName, arguments[i]);
      }
    }
    if (typeof callbacks === 'object' && callbacks.forEach) {
      // @ts-ignore
      callbacks.forEach(fn => {
        this.addEvent(eventName, fn);
      });
    }
  }
  // @ts-ignore
  public remove(eventName, callbacks) {
    if (!eventName) {
      return;
    }
    for (let i = 0; i < this.eventBusCore.length; i++) {
      // @ts-ignore
      if (this.eventBusCore[i].eventName === eventName) {
        if (arguments.length === 1) {
          return this.eventBusCore.splice(i, 1);
        }
        const removedEvent = this.eventBusCore.splice(i, 1)[0];
        if (typeof callbacks === 'function') {
          for (let k = 1; k < arguments.length; k++) {
            // @ts-ignore
            removedEvent.eventFuncArr = this.removeFuncInFuncArr(removedEvent.eventFuncArr, arguments[k]);
          }
        }
        if (typeof callbacks === 'object' && callbacks.length) {
          for (let x = 0; x < callbacks.length; x++) {
            // @ts-ignore
            removedEvent.eventFuncArr = this.removeFuncInFuncArr(removedEvent.eventFuncArr, callbacks[x]);
          }
        }
        this.eventBusCore.push(removedEvent);
      }
    }
  }
  // @ts-ignore
  public trigger(eventName, data) {
    const event = this.getKeyValueObjInArr(this.eventBusCore, 'eventName', eventName);
    if (event) {
      (event.eventFuncArr || []).forEach((fn: any) => {
        fn.apply(this, data);
      });
    }
  }
}
