<template>
  <div id="App">
    <BootstrapSidebar 
      :initial-show="initialShow" 
      :links="links"
      :header="header"
      :fa="true"
      @sidebarChanged="onSidebarChanged"
    >
      <template v-slot:navbar>
        <b-navbar 
          id="mainNavbar" 
          toggleable="lg" 
          type="light" 
          variant="light" 
          fixed="top"
        >
          <b-navbar-nav>
            <b-nav-item>
              COVID-19
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar>
      </template>
      
      <template v-slot:content>
        <b-container style="margin-top: 56px">
          <router-view />
        </b-container>
      </template>
    </BootstrapSidebar>
  </div>
</template>

<script>
import Vue from 'vue'
import BootstrapSidebar from './components/vue-bootstrap-sidebar.vue'

export default Vue.extend({
  name: 'App',
  components: {
    BootstrapSidebar
  },
  data () {
    return {
      initialShow: false,
      header: '<h3>&nbsp;</h3>',
      links: [
        { name: 'Argentina', href: { name: 'dashboard' }, faIcon: ['fas', 'home'] },
        /*
        { name: 'Dropdown',
          faIcon: ['fas', 'tint'],
          children: [
            { name: 'Child Item 1', href: { name: 'child-item-1' }, 
              faIcon: ['fas', 'child'] },
            { name: 'Child Item 2', href: { name: 'child-item-2' }, 
              faIcon: ['fas', 'child'] }
          ]
        },
        */
        { name: 'Global', href: { name: 'global' }, faIcon: ['fas', 'circle'] },
        { name: 'Acerca', href: { name: 'about' }, faIcon: 'users' },
      ]
    }
  },
  methods: {
    onSidebarChanged () {
    }
  }
});
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
@import './scss/default-theme';
</style>
