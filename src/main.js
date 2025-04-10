import 'vant/lib/index.css';
import './assets/main.css';

import { createApp } from 'vue';
import VueKonva from 'vue-konva';
import { Button, Field, Icon,
  CellGroup, Cell, SwipeCell,
  Tabbar, TabbarItem,
  Radio, RadioGroup, Slider,
  Popup, Toast, Dialog
 } from 'vant';
import router from './views/router';
import App from './App.vue';

const app = createApp(App)

app.use(router).use(VueKonva)
  .use(Button).use(Field).use(Icon)
  .use(Cell).use(CellGroup).use(SwipeCell)
  .use(Tabbar).use(TabbarItem)
  .use(Radio).use(RadioGroup).use(Slider)
  .use(Popup).use(Toast).use(Dialog);

app.mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
      .then((registration) => console.log('Service Worker is registered with scope:', registration.scope))
      .catch((err) => console.error('Service Worker error:', err));
}
