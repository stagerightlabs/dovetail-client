<template>
  <div v-if="loading" class="center-xy">
    <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon>
  </div>
  <div v-else class="flex">
    <main-menu :mobile-nav-hidden="mobileNavHidden" @close="hideMobileNav"></main-menu>
    <div class="flex-auto">
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
import { User, Organization } from '@/types';
import http from '@/repositories/session';
import BaseView from '@/mixins/BaseView.ts';
import MainMenu from '@/components/MainMenu.vue';
import { Action, Getter, Mutation } from 'vuex-class'
import Component, { mixins } from 'vue-class-component';

@Component({
  components: { MainMenu }
})
export default class Console extends mixins(BaseView) {

  mobileNavHidden = true;
  loading = false;

  @Action('logout', {namespace: 'session'}) logout : any;
  @Getter('isAuthenticated', {namespace: 'session'}) isAuthenticated! : boolean;
  @Mutation('saveSessionUser', {namespace: 'session'}) saveSessionUser! : (user: User) => void;
  @Mutation('saveSessionOrganization', {namespace: 'session'}) saveSessionOrganization! : (organization: Organization) => void;
  @Mutation('saveAdministratorStatus', {namespace: 'session'}) saveAdministratorStatus! : (status: boolean) => void;
  @Mutation('saveReadonlyStatus', {namespace: 'session'}) saveReadonlyStatus! : (status: boolean) => void;
  @Getter('profileHasBeenLoaded', {namespace: 'session'}) profileHasBeenLoaded! : boolean;

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
    if (!this.profileHasBeenLoaded) {
      this.loading = true;
    }
  }

  mounted() {
    // Fetch the current user's profile
    const promise1 = http.getUser()
      .then((response) => {
        this.saveSessionUser(response.data.data);
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        //this.$router.push({name: 'logout'});
      });

    // Fetch the current user's organization
    const promise2 = http.getOrganization()
      .then((response) => {
        this.saveSessionOrganization(response.data.data);
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });

    // Is this user an administrator?
    const promise3 = http.getAdministratorStatus()
      .then((response) => {
        this.saveAdministratorStatus(response.data.data);
      })
      .catch(() => {});

    // Should this user be restricted to read only access?
    const promise4 = http.getReadOnlyStatus()
      .then((response) => {
        this.saveReadonlyStatus(response.data.data);
      })
      .catch(() => {});

    // Loading is complete when our promises have been resolved
    Promise.all([promise1, promise2, promise3, promise4]).then(() => {
      this.loading = false;
    })
  }
}
</script>
