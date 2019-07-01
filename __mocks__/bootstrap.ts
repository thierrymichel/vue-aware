// https://stackoverflow.com/questions/40743131/how-to-prevent-property-does-not-exist-on-type-global-with-jsdom-and-t
(window as any).IntersectionObserver = class {
  public observe() {}
  public unobserve() {}
};

import Vue from 'vue';
(window as any).Vue = Vue;

import SvgAware from '../src';

export default function bootstrap() {
  Vue.use(SvgAware);

  return Vue;
}
