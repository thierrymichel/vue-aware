import _Vue from 'vue';
import { IOption } from '../directives/aware';
import { Manager } from './manager';

type rafCallback = (delta: number, now: number, context: _Vue) => void;

interface IRafOption extends IOption<rafCallback> {}

export class Raf extends Manager<IRafOption> {
  private oldTime: number;
  private raf: number;

  constructor(eventName: string) {
    super(eventName);
    this.handler = this.handler.bind(this);
    this.onTick = this.onTick.bind(this);
    this.oldTime = 0;
  }

  public bind() {
    this.raf = window.requestAnimationFrame(this.onTick);
  }

  public unbind() {
    window.cancelAnimationFrame(this.raf);
  }

  private handler(delta: number, now: number) {
    this.optionsByElement.forEach(o => {
      o.callback(delta, now, o.context);
    });
  }

  private onTick(now: number) {
    const delta = (now - this.oldTime) / 1000;

    this.oldTime = now;
    this.handler(delta, now);
    this.raf = window.requestAnimationFrame(this.onTick);
  }
}
