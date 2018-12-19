<template>
  <div v-if="loading" class="center-xy">
    <!-- <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon> -->
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Members</h1>
    </div>
    <div v-for="member in members" :key="member.hashid">
      <div v-if="isEditing(member)">
        <div class="input-group">
          <label>Name:</label>
          <input
            type="text"
            id="text-name"
            v-model="editing.name"
            name="name"
            required
            v-validate
          >
          <div class="input-error">{{ errors.first('name') }}</div>
        </div>
        <div class="input-group">
          <label>Title:</label>
          <input
            type="text"
            id="text-name"
            v-model="editing.title"
            name="title"
          >
          <div class="input-error">{{ errors.first('title') }}</div>
        </div>
        <div class="input-group">
          <label>E-mail:</label>
          <input
            type="email"
            id="text-email"
            v-model="editing.email"
            name="email"
            required
            v-validate
          >
          <div class="input-error">{{ errors.first('title') }}</div>
        </div>
        <div class="input-group">
          <action-button id="btn-update" :spin="submittingUpdates" @click="update(member)">Update</action-button>
          <button id="btn-cancel" @click="cancelUpdate">Cancel</button>
        </div>
      </div>
      <div v-else>
        <p>{{ member.name }}</p>
        <p>{{ member.title }}</p>
        <p>{{ member.email }}</p>
        <p><button id="btn-edit" @click="edit(member)">Edit</button></p>
        <p><button id="btn-delete" @click="destroy(member)">Edit</button></p>
      </div>
    </div>

  </main>
</template>

<script lang="ts">
import { Member } from '@/types';
import cloneDeep from 'lodash.clonedeep';
import BaseView from '@/mixins/BaseView.ts';
import members from '@/repositories/members';
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
  editing: Member|null = null;
  submittingUpdates: boolean = false;

  /**
   * Request a list of members from the server
   */
  requestMembers() {
    members.index()
      .then((response) => {
        this.members = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Request a list of deleted users from the server
   */
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
   * Flag a member for editing
   */
  edit(member: Member) : void {
    this.editing = cloneDeep(member);
  }

  /**
   * Determine if a member is currently being edited
   */
  isEditing(member: Member) : boolean {
    return this.editing
      ? this.editing.hashid === member.hashid
      : false;
  }

  /**
   * Validate form inputs before submitting an update request
   */
  async update(member: Member) {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitUpdates(member)
          this.submittingUpdates = true;
        }
      })
  }

  /**
   * Cancel an editing operation, restoring the original data
   */
  cancelUpdate() {
    this.editing = null;
  }

  /**
   * Ask the server to delete a member
   */
  destroy(member: Member) {
    members.delete(member)
      .then(() => {
        this.removeModel(this.members, member);
        this.toast({message: `Deleted ${member.email}`, level: 'success'});
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

  /**
   * Ask the server to update a member
   */
  private submitUpdates(member: Member) {
    members.update(member)
      .then((response) => {
        this.addOrUpdateModel(this.members, response.data.data);
        this.submittingUpdates = false;
        this.editing = null;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

}
</script>

<style>

</style>
