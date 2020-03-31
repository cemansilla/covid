import VueRouter from 'vue-router'
import DashboardPage from './DashboardPage.vue'
import AboutPage from './AboutPage.vue'

import PageNotFound from './PageNotFound.vue'

const routes = [
  { path: '/', component: DashboardPage, name: 'dashboard', meta: { title: 'COVID-19 @cemansilla' } },
  { path: '/about', component: AboutPage, name: 'about', meta: { title: 'COVID-19 @cemansilla' } },
  { path: '/global', component: PageNotFound, name: 'global', meta: { title: 'COVID-19 @cemansilla' } },
  { path: '*', component: PageNotFound },
]

export const router = new VueRouter({
  mode: 'history',
  routes,
  base: process.env.NODE_ENV === 'production'
    ? '/covid-19/'
    : '/'
})

// Procesamiento de metatags
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  //const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));
  
  if(!nearestWithMeta) return next();

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  .forEach(tag => document.head.appendChild(tag));

  next();
});