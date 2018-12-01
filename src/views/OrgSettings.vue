<template>
  <main role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Organization Settings</h1>

    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseView from '@/mixins/BaseView.ts';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class OrgSettings extends mixins(BaseView) {
  @Getter('organization', {namespace: 'session'}) organization! : boolean;
}
</script>

<style>

</style>
