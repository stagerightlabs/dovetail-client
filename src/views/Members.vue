<template>
  <main role="main" class="page">
    <header>
      <h1>Members</h1>
      <aside>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" :spin="refreshing"></icon>
        </button>
      </aside>
    </header>
    <article>
      <section class="content">
        <div v-if="loading" class="flex h-32 items-center justify-center">
          <icon name="refresh" width="32" height="32" spin />
        </div>
        <div v-else v-for="member in members" :key="member.hashid" class="faux-row">
          <form
            v-if="isEditing(member)"
            class="p-4 bg-grey-lighter rounded w-full"
            @keydown.esc="cancelUpdate">
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
              <div class="input-error">{{ errors.first('email') }}</div>
            </div>
            <div class="text-right">
              <action-button
                id="btn-update"
                class="btn btn-green"
                :spin="submittingUpdates"
                @click="update(member)"
                prevent
              >Update</action-button>
              <button
                id="btn-cancel"
                class="btn btn-red ml-2"
                @click.prevent="cancelUpdate"
              >Cancel</button>
            </div>
          </form>
          <template v-else>
            <p class="md:w-1/4">
              {{ member.name }}
              <small v-if="member.blocked" class="ml-1 text-grey-darker">
                <icon name="exclamation-outline" width="12" height="12" />
                Blocked
              </small>
              <icon name="shield" class="text-grey-darker" title="Administrator" v-if="memberIsAdmin(member)"></icon>
            </p>
            <p class="md:w-1/4">{{ member.title }}</p>
            <p class="md:w-1/4">{{ member.email }}</p>
            <p class="md:w-1/4">
              <action-button
                id="btn-edit"
                @click="edit(member)"
                class="btn btn-blue"
                :spin="submittingUpdates"
              >Edit</action-button>
              <action-button
                v-if="!member.blocked"
                id="btn-block"
                class="btn btn-green ml-2"
                @click="block(member)"
                :spin="isBlocking(member)"
              >Block</action-button>
              <action-button
                v-if="member.blocked"
                id="btn-unblock"
                class="btn btn-red ml-2"
                @click="unblock(member)"
                :spin="isBlocking(member)"
              >Unblock</action-button>
              <action-button
                id="btn-delete"
                class="btn btn-red ml-2"
                @click="destroy(member)"
                :spin="isDeleting(member)"
                v-if="!memberIsCurrentUser(member)"
                confirm
                :message="`Are you sure you want to remove ${member.name}?`"
              >Remove</action-button>
            </p>
          </template>
        </div>
      </section>
    </article>

    <article v-if="deletedMembers.length">
      <header>
        <h3>Deleted Members</h3>
      </header>
      <section class="content">
        <div v-for="member in deletedMembers" :key="member.hashid" class="member">
          <div class="flex justify-between items-baseline">
            <p>
              {{ member.name }}
              <small v-if="member.blocked" class="ml-1 text-grey-darker">
                <icon name="exclamation-outline" width="12" height="12" />
                Blocked
              </small>
            </p>
            <p>{{ member.title }}</p>
            <p>{{ member.email }}</p>
            <action-button
              id="btn-restore"
              :spin="isRestoring(member)"
              class="btn btn-red"
              @click="restore(member)"
            >Restore</action-button>
          </div>
        </div>
      </section>
    </article>

    <footer>
      <p class="text-center">
        Want to add more members?
        <router-link :to="{name: 'invitations'}">
          Send invitations
        </router-link>
      </p>
    </footer>
  </main>
</template>

<script lang="ts">
import { User } from '@/types';
import { Member } from '@/types';
import { Getter } from 'vuex-class'
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
  refreshing: boolean = false;
  editing: Member|null = null;
  deleting: Member|null = null;
  blocking: Member|null = null;
  restoring: Member|null = null;
  submittingUpdates: boolean = false;

  @Getter('user', {namespace: 'session'}) user! : User;

  /**
   * Request a list of members from the server
   */
  fetchMembers() {
    if (this.userIsNotAllowedToSeeThisPage) {
      return;
    }

    return members.index()
      .then((response) => {
        this.members = response.data.data;
        this.loading = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Request a list of deleted users from the server
   */
  fetchDeletedMembers() {
    if (this.userIsNotAllowedToSeeThisPage) {
      return;
    }

    return members.deletedMembers()
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
   * Determine if a member is currently being edited
   */
  isDeleting(member: Member) : boolean {
    return this.deleting
      ? this.deleting.hashid === member.hashid
      : false;
  }

  /**
   * Determine if a member is currently being edited
   */
  isRestoring(member: Member) : boolean {
    return this.restoring
      ? this.restoring.hashid === member.hashid
      : false;
  }

  /**
   * Determine if a member is currently being blocked or unblocked
   */
  isBlocking(member: Member) : boolean {
    return this.blocking
      ? this.blocking.hashid === member.hashid
      : false;
  }

  /**
   * Does a member represent the current user?
   */
  memberIsCurrentUser(member: Member) {
    return member.hashid === this.user.hashid;
  }

  /**
   * Is this member an administrator?
   */
  memberIsAdmin(member: Member) {
    return member.rank === 'Admin';
  }

  /**
   * Validate form inputs before submitting an update request
   */
  async update(member: Member) {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitUpdates();
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
    this.deleting = member;
    members.delete(member)
      .then(() => {
        this.removeModel(this.members, member);
        this.addOrUpdateModel(this.deletedMembers, member);
        this.deleting = null;
        this.toast({message: `Deleted ${member.name}`, level: 'success'});
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.deleting = null;
      })
  }

  /**
   * Ask the server to block a member
   */
  block(member: Member) {
    this.blocking = member;
    members.block(member)
      .then(() => {
        member.blocked = true;
        this.blocking = null;
        this.toast({
          message: `${member.name} has been blocked.`,
          level: 'success'
        });
      })
  }

  /**
   * Ask the server to block a member
   */
  unblock(member: Member) {
    this.blocking = member;
    members.unblock(member)
      .then(() => {
        member.blocked = false;
        this.blocking = null;
        this.toast({
          message: `${member.name} has been unblocked.`,
          level: 'success'
        });
      })
  }

  /**
   * Refresh the member listings
   */
  refresh() {
    this.refreshing = true;
    const p1 = this.fetchMembers();
    const p2 = this.fetchDeletedMembers();

    Promise.all([p1, p2]).finally(() => {
      this.refreshing = false;
    })
  }

  /**
   * Ask the server to delete a member
   */
  restore(member: Member) {
    this.restoring = member;
    members.restore(member)
      .then(() => {
        this.removeModel(this.deletedMembers, member);
        this.addOrUpdateModel(this.members, member);
        this.restoring = null;
        this.toast({message: `Member ${member.email} has been restored.`, level: 'success'});
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.restoring = null;
      })
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.fetchMembers();
    this.fetchDeletedMembers();
  }

  /**
   * Ask the server to update a member
   */
  private submitUpdates() {
    if (!this.editing) {
      return;
    }
    members.update(this.editing)
      .then((response) => {
        this.addOrUpdateModel(this.members, response.data.data);
        this.submittingUpdates = false;
        this.editing = null;
        this.toast({
          message: `${response.data.data.name} has been updated`,
          level: 'success'
        });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.submittingUpdates = false;
      });
  }

}
</script>
