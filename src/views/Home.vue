<template>
  <div class="flex">
    <main-menu :mobile-nav-hidden="mobileNavHidden" @close="hideMobileNav"></main-menu>
    <div class="flex-auto" >
      <router-view/>
    </div>
    <div class="block sm:hidden absolute pin-t pin-r">
      <button @click="showMobileNav" class="flex items-center px-3 py-2 border-0 rounded text-white">
        <fa-icon icon="bars" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EventBus from '@/bus';
import { Action, Getter } from 'vuex-class'
import Component from 'vue-class-component';
import MainMenu from '@/components/MainMenu.vue';

@Component({
  components: { MainMenu }
})
export default class Home extends Vue {
  @Action('logout', {namespace: 'auth'}) logout : any;
  @Getter('isAuthenticated', {namespace: 'auth'}) isAuthenticated! : boolean;

  mobileNavHidden = true;

  terminateSession() {
    this.logout()
  }

  sendAlert() {
    EventBus.$emit('toast', {message: "hello world", level: "info"});
  }

  showMobileNav() {
    this.mobileNavHidden = false;
  }

  hideMobileNav() {
    this.mobileNavHidden = true;
  }
}
</script>
