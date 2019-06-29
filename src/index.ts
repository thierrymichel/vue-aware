import _Vue from 'vue';
import { version } from '../package.json';
import Aware from './directives/aware';

// Install the components
// tslint:disable-next-line:variable-name
function install(Vue: typeof _Vue) {
  // export function install(Vue: typeof _Vue) {
  Vue.directive('aware', Aware);

  /* -- Add more components here -- */
}

// export {
//   Aware,
// };

/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
const plugin = {
  install,
  version,
};

export default plugin;

// Auto-install
// tslint:disable-next-line:variable-name
let GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = (window as any).Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = (global as any).Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}
