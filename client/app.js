import App from './App.vue';
import AlbumPage from './views/AlbumPage.vue';
import AlbumsPage from './views/AlbumsPage.vue';
import PersonPage from './views/PersonPage.vue';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/album/:id', component: AlbumPage },
    { path: '/person/:id', component: PersonPage },
    { path: '*', component: AlbumsPage },
  ],
});

new Vue({
  el: '#app',
  render: h => h(App),
  router,
});