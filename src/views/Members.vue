<template>
  <div v-if="loading" class="center-xy">
    <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon>
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Invitations</h1>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { Member } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import members from '@/repositories/members';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class Members extends mixins(BaseView) {
  members: Member[] = [];
  deletedMembers: Member[] = [];
  loading: boolean = true;

  requestMembers() {
    members.index()
      .then((response) => {
        this.members = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  requestDeletedMembers() {
    members.deletedMembers()
      .then((response) => {
        this.deletedMembers = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.requestMembers();
    this.requestDeletedMembers();
  }
}
</script>

<style>

</style>
