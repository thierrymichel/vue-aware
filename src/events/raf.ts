import { Manager } from './manager';

export class Raf extends Manager {
  private oldTime: number;
  private raf: number;

  constructor() {
    super();
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
    this.callbacksByElement.forEach(cb => {
      cb(delta, now);
    });
  }

  private onTick(now: number) {
    const delta = (now - this.oldTime) / 1000;

    this.oldTime = now;
    this.handler(delta, now);
    this.raf = window.requestAnimationFrame(this.onTick);
  }
}
