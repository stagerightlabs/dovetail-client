<template>
  <div v-if="loading" class="center-xy">
    <img src="@/assets/dovetail_logo_blue.png" class="w-32 mt-6">
  </div>
  <div v-else class="flex">
    <main-menu :mobile-nav-hidden="mobileNavHidden" @close="hideMobileNav"></main-menu>
    <div class="flex-auto">
      <router-view/>
    </div>
    <div class="block sm:hidden absolute pin-t pin-r">
      <button @click="showMobileNav" class="flex items-center px-3 py-2 border-0 rounded text-white">
        <icon name="menu"></icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import EventBus from '@/bus';
import { Route } from 'vue-router';
import Icon from '@/components/Icon.vue'
import http from '@/repositories/session';
import BaseView from '@/mixins/BaseView.ts';
import { User, Organization } from '@/types';
import MainMenu from '@/components/MainMenu.vue';
import { Vue, Watch } from 'vue-property-decorator';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';

@Component({
  components: { Icon, MainMenu }
})
export default class Console extends mixins(BaseView) {

  mobileNavHidden = true;
  loading = false;

  @Action('logout', {namespace: 'session'}) logout : any;
  @Getter('isAuthenticated', {namespace: 'session'}) isAuthenticated! : boolean;
  @Getter('isAdministrator', {namespace: 'session'}) isAdministrator! : boolean;
  @Mutation('saveSessionUser', {namespace: 'session'}) saveSessionUser! : (user: User) => void;
  @Mutation('saveSessionOrganization', {namespace: 'session'}) saveSessionOrganization! : (organization: Organization) => void;
  @Mutation('saveAdministratorStatus', {namespace: 'session'}) saveAdministratorStatus! : (status: boolean) => void;
  @Mutation('saveReadonlyStatus', {namespace: 'session'}) saveReadonlyStatus! : (status: boolean) => void;
  @Getter('profileHasBeenLoaded', {namespace: 'session'}) profileHasBeenLoaded! : boolean;

  /**
   * A helper method to show the mobile nav menu
   */
  showMobileNav() {
    this.mobileNavHidden = false;
  }

  /**
   * A helper method to hide the mobile nav menu
   */
  hideMobileNav() {
    this.mobileNavHidden = true;
  }

  /**
   * Make sure the loading signal is displayed while we wait for the user profile data
   */
  beforeMount() {
    if (!this.profileHasBeenLoaded) {
      this.loading = true;
    }
  }

  /**
   * Ask the server to tell us more about the current user
   */
  loadUserProfile() {
     // Fetch the current user's profile
    const promise1 = http.getUser()
      .then((response) => {
        this.saveSessionUser(response.data.data);
      });

    // Fetch the current user's organization
    const promise2 = http.getOrganization()
      .then((response) => {
        this.saveSessionOrganization(response.data.data);
      });

    // Is this user an administrator?
    const promise3 = http.getAdministratorStatus()
      .then((response) => {
        this.saveAdministratorStatus(response.data.data.admin);
      });

    // Should this user be restricted to read only access?
    const promise4 = http.getReadOnlyStatus()
      .then((response) => {
        this.saveReadonlyStatus(response.data.data);
      });

    // Loading is complete when our promises have been resolved
    return Promise.all([promise1, promise2, promise3, promise4]).then(() => {
      this.loading = false;
    })
    .catch((error) => {
      this.handleResponseErrors(error);
    });
  }

  /**
   * A helper method that redirects the user to their dashboard
   */
  redirectToDashboard() {
    this.$router.push({ name: 'dashboard' });
    this.toast({
      message: "Only Administrators are allowed to do that.",
      level: 'info'
    });
  }

  /**
   * The mounted lifecycle hook
   */
  async mounted() {

    // Stop everything until the user profile has been loaded
    if (!this.profileHasBeenLoaded) {
      await this.loadUserProfile();
    }

    // Check to make sure that the current user is allowed to see this page
    if (this.userIsNotAllowedToSeeThisPage) {
      return this.redirectToDashboard();
    }
  }

  /**
   * We will monitor the router to prevent regular users from
   * gaining access to administrator routes
   */
  @Watch('$route')
  onRouteChanged(newRoute: Route, oldRoute: Route) {
    if (newRoute.meta.requiresAdmin && !this.isAdministrator) {
      this.redirectToDashboard();
    }
  }
}
</script>
