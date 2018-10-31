<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/logout">Logout</router-link> |
      <a @click="sendAlert" class="cursor-pointer">Toast</a>
    </div>
    <div>
      <p v-if="isAuthenticated">There is an active session</p>
    </div>
    <router-view/>
    <!-- Alert Stack -->
    <flash-stack></flash-stack>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EventBus from '@/bus';
import { Action, Getter } from 'vuex-class'
import Component from 'vue-class-component';
import FlashStack from '@/components/FlashStack.vue';

@Component({
  components: { FlashStack }
})
export default class App extends Vue {
  @Action('logout', {namespace: 'auth'}) logout : any;
  @Getter('isAuthenticated', {namespace: 'auth'}) isAuthenticated! : boolean;

  terminateSession() {
    this.logout()
  }

  sendAlert() {
    EventBus.$emit('toast', {message: "hello world", level: "info"});
  }
}
</script>

<style lang="scss">
@import './assets/styles.scss';
</style>
