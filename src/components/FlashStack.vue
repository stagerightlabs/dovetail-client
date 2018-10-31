<template>
  <div id="alert-stack">
    <transition-group name="stack">
    <message
      v-for="alert in alerts"
      :message="alert.message"
      :level="alert.level"
      :nonce="alert.nonce"
      :key="alert.nonce"
      :delay=6000
      v-on:remove="remove"
    ></message>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EventBus from '@/bus';
import { Alert } from '@/types';
import Component from 'vue-class-component';
import FlashMessage from '@/components/FlashMessage.vue';

@Component({
  components: { 'message': FlashMessage }
})
export default class FlashStack extends Vue {

  alerts: Alert[] = [];

  toast(alert : Alert) {
    alert.nonce = this.generateNonce();
    this.alerts.push(alert);
  }

  remove(nonce: string) {
    const index = this.alerts.findIndex(alert => alert.nonce === nonce);

    if (index !== -1) {
      this.alerts.splice(index, 1);
    }
  }

  generateNonce() {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  created() {
    EventBus.$on('toast', (alert: Alert) => this.toast(alert) );
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.stack-enter-active,
.stack-leave-active {
  transition: all 1s;
}
.stack-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
