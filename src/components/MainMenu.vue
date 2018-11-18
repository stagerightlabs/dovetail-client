<template>
  <div class="main-menu sm:flex" :class="{'hidden': mobileNavHidden}" role="navigation">
    <div id="menu" class="flex flex-column">
      <header class="nav-header">
        <h1 class="mb-2">dovetail</h1>
        <h4>{{ this.organization.name }}</h4>
      </header>
      <nav>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/logout">Logout</router-link>
        <a @click="sendAlert" class="cursor-pointer">Toast</a>
      </nav>
    </div>
    <footer>
      <div class="session-footer" v-if="isAuthenticated">
        <div class="avatar">
          <fa-icon icon="user-circle" size="2x"></fa-icon>
        </div>
        <div class="user">
          <p>{{ user.name }}</p>
          <p>{{ user.email }}</p>
        </div>
      </div>
    </footer>
    <div class="block sm:hidden absolute pin-t pin-r">
      <button @click="closeMobileNav" class="flex items-center px-3 py-2 border-0 rounded text-blue-lightest">
        <fa-icon icon="times" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import EventBus from '@/bus';
import { Action, Getter } from 'vuex-class'
import { User, Organization } from '@/types';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class MainMenu extends Vue {

  @Prop({ default: true }) mobileNavHidden!: boolean
  @Getter('user', {namespace: 'session'}) user! : User;
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
