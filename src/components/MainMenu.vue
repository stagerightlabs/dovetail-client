<template>
  <div class="main-menu sm:flex" :class="{'hidden': mobileNavHidden}" role="navigation">
    <div id="menu" class="flex flex-column">
      <header class="nav-header">
        <router-link :to="{name: 'dashboard'}">
          <h1 class="mb-2">dovetail</h1>
          <h4>{{ this.organization.name }}</h4>
        </router-link>
      </header>
      <nav>
        <router-link to="#">{{ orgNotebooksLabel }}</router-link>
        <router-link :to="{name: 'categories'}">Categories</router-link>
        <router-link to="/logout" class="nav-button">
          <icon name="lock-closed" />
          Logout
        </router-link>
      </nav>
      <div v-if="isAuthenticated && isAdministrator">
        <h5 class="text-center mb-4">Administration</h5>
        <nav>
          <router-link to="#">Members</router-link>
          <router-link to="#">Teams</router-link>
          <router-link :to="{ name: 'invitations' }">Invitations</router-link>
          <router-link to="#">Settings</router-link>
        </nav>
      </div>
    </div>
    <footer>
      <div class="session-footer" v-if="isAuthenticated">
          <div class="avatar">
            <router-link :to="{name: 'profile'}">
              <icon name="user-solid-circle" height="24" width="24" />
            </router-link>
          </div>
          <div class="user">
            <router-link :to="{name: 'profile'}">
              <p>{{ user.name }}</p>
              <p>{{ user.email }}</p>
            </router-link>
          </div>
      </div>
    </footer>
    <div class="block sm:hidden absolute pin-t pin-r">
      <button @click="closeMobileNav" class="flex items-center px-3 py-2 border-0 rounded text-blue-lightest">
        <icon name="close"></icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import EventBus from '@/bus';
import Icon from '@/components/Icon.vue'
import { Action, Getter } from 'vuex-class'
import { User, Organization } from '@/types';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({components: {Icon}})
export default class MainMenu extends Vue {

  @Prop({ default: true }) mobileNavHidden!: boolean
  @Getter('user', {namespace: 'session'}) user! : User;
  @Getter('isAdministrator', {namespace: 'session'}) isAdministrator! : boolean;
  @Getter('orgNotebooksLabel', {namespace: 'session'}) orgNotebooksLabel! : boolean;
  @Action('logout', {namespace: 'session'}) logout : any;
  @Getter('organization', {namespace: 'session'}) organization! : User;
  @Getter('isAuthenticated', {namespace: 'session'}) isAuthenticated! : boolean;

  terminateSession() {
    this.logout()
  }

  sendAlert() {
    EventBus.$emit('toast', {message: "hello world", level: "info"});
  }

  closeMobileNav() {
    this.$emit('close');
  }
}
</script>
