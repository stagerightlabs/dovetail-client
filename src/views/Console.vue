<template>
  <div v-if="loading" class="center-xy">
    <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon>
  </div>
  <div v-else class="flex">
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
import BaseView from '@/mixins/BaseView.ts';
import http from '@/repositories/session';
import { Action, Getter } from 'vuex-class'
import Component, { mixins } from 'vue-class-component';
import MainMenu from '@/components/MainMenu.vue';

@Component({
  components: { MainMenu }
})
export default class Console extends mixins(BaseView) {
  @Action('logout', {namespace: 'auth'}) logout : any;
  @Getter('isAuthenticated', {namespace: 'auth'}) isAuthenticated! : boolean;

  mobileNavHidden = true;
  loading = false;
  user = {};

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

  beforeMount() {
    this.loading = true;
  }

  mounted() {
    http.getUser()
      .then((response) => {
        this.user = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.$router.push({name: 'logout'});
      })
  }
}
</script>
