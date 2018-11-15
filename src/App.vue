<template>
  <div id="app">
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

}
</script>

<style lang="scss">
@import './assets/styles.scss';
</style>
