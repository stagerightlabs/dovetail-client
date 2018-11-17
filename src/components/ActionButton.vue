<template>
  <button :class="{'disabled': spin}" @click="$emit('click')">
    <span v-if="spin" class="mx-7">
      <fa-icon icon="spinner" spin></fa-icon>
    </span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class ActionButton extends Vue {
  @Prop({ default: false }) spin!: boolean;
}
</script>

<style>

</style>
