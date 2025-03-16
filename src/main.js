import 'vant/lib/index.css';
import './assets/main.css';

import { createApp } from 'vue';
import VueKonva from 'vue-konva';
import { Button } from 'vant';
import router from './views/router';
import App from './App.vue';

const app = createApp(App)

app.use(router).use(VueKonva).use(Button);
app.mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service Worker is registered'))
      .catch((err) => console.log('Service Worker error:', err));
}
