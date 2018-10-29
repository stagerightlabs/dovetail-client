<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <a @click="terminateSession">Logout</a>
    </div>
    <div>
      <p v-if="isAuthenticated">There is an active session</p>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action, Getter } from 'vuex-class'
import Component from 'vue-class-component';

@Component({})
export default class App extends Vue {
  @Action('logout', {namespace: 'auth'}) logout : any;
  @Getter('isAuthenticated', {namespace: 'auth'}) isAuthenticated! : boolean;

  terminateSession() {
    this.logout()
  }
}
</script>

<style lang="scss">
@import './assets/styles.scss';
</style>
