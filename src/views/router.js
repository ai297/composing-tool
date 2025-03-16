import { createRouter, createMemoryHistory } from 'vue-router';
import HomeView from './HomeView.vue';
import EditorView from './EditorView.vue';

export default createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomeView, },
    { path: '/edit', component: EditorView, }
  ],
});
