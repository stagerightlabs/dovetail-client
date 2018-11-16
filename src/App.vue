<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>

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

}
</script>

<style lang="scss">
@import './assets/styles.scss';

.fade-enter-active, .fade-leave-active {
  transition: opacity .1s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
