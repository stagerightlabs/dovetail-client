<template>
  <div class="main-menu sm:block" :class="{'hidden': mobileNavHidden}" role="navigation">
    <h1 class="text-center my-8">Hello World</h1>
    <nav>
      <router-link to="/">Dashboard</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/logout">Logout</router-link>
      <a @click="sendAlert" class="cursor-pointer">Toast</a>
    </nav>
    <div>
      <p v-if="isAuthenticated">There is an active session</p>
    </div>
    <div class="block sm:hidden absolute pin-t pin-r">
      <button @click="closeMobileNav" class="flex items-center px-3 py-2 border-0 rounded text-blue-lightest">
        <!-- <fa-icon icon="times" /> -->
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import EventBus from '@/bus';
import { Action, Getter } from 'vuex-class'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Menu extends Vue {
  @Action('logout', {namespace: 'session'}) logout : any;
  @Getter('isAuthenticated', {namespace: 'session'}) isAuthenticated! : boolean;
  @Prop({ default: true }) mobileNavHidden!: boolean

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

<style lang="scss" rel="stylesheet/scss">

</style>
