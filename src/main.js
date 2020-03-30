import Vue from 'vue';
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faUsers, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { router } from './components/router'
import VueGtag from "vue-gtag";

Vue.use(VueGtag, {
  config: { id: "UA-153117765-2" }
});

library.add(faCircle)
library.add(faHome)
library.add(faUsers)

Vue.config.productionTip = false;

Vue.use(VueRouter)
Vue.use(BootstrapVue)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  render: (h) => h(App),
  router
}).$mount('#app');
