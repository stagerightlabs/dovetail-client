<template>
  <div v-if="loading" class="center-xy">
    <!-- <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon> -->
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>{{ team.name }}</h1>
      <div>
        <button @click="showEditForm" class="text-grey-light" id="btn-show-create-form">
          <!-- <fa-icon icon="edit" ></fa-icon> Edit -->
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <!-- <fa-icon icon="sync-alt" ></fa-icon> Refresh -->
        </button>
      </div>
    </div>
    <div v-if="editFormVisible" class="content flex items-start">
      <label for="edit-team-name" class="pt-2">Name:</label>
      <div class="ml-2 flex-grow">
        <input
          type="text"
          name="name"
          class="leading-none"
          id="edit-team-name"
          v-model="editedTeamName"
          ref="editedTeamNameInput"
          @keydown.esc="cancelNewTeam"
          @keydown.enter="create"
          required
          v-validate
        >
        <div class="input-error flex-none">{{ errors.first('name') }}</div>
      </div>
      <action-button
        id="btn-update"
        class="btn btn-green ml-2"
        @click="update"
        :spin="updatingTeam"
      >
        Send
      </action-button>
      <button
        class="btn btn-red ml-2"
        @click="cancelEditing"
      >
        Cancel
      </button>
    </div>
    <div>
      <div class="member-header flex justify-between items-center">
        <h3>Members</h3>
        <div>
          <button id="btn-add-member" @click="addMember(allMembers[0])">Add Member</button>
        </div>
      </div>
      <div v-if="hasMembers" v-for="member in team.members" :key="member.hashid">
        <p>{{ member.name }}</p>
        <button id="btn-remove-member" @click="removeTeamMember(member)">Remove</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Team, Member } from '@/types';
import cloneDeep from 'lodash.clonedeep';
import teams from '@/repositories/teams';
import BaseView from '@/mixins/BaseView.ts';
import members from '@/repositories/members';
import { mixins } from 'vue-class-component';
import { Action, Getter, Mutation } from 'vuex-class';
import { Prop, Component } from 'vue-property-decorator'
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class TeamView extends mixins(BaseView) {
  @Prop({ required: true }) hashid!: string;

  team: Team|null = null;
  allMembers: Member[] = [];
  loading: boolean = true;
  editFormVisible: boolean = true;
  editedTeamName: string = '';
  updatingTeam: boolean = false;

  /**
   * Element refs
   */
  $refs!: {
    editedTeamNameInput: HTMLFormElement
  }

  /**
   * Add a new member to this team
   */
  addMember(member: Member|undefined) {
    if (!member || !this.team) {
      return;
    }
    teams.addMember(this.team, member)
      .then((response) => {
        if (this.team && this.team.members) {
          this.addOrUpdateModel(this.team.members, member);
          this.toast({
            message: `${member.name} has been added to this team.`,
            level: 'success'
          })
        }
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Cancel editing
   */
  cancelEditing() {
    this.editFormVisible = false;
    this.editedTeamName = '';
  }

  /**
   * Request team information from the server
   */
  private fetchTeam() {
    teams.show(this.hashid)
      .then((response) => {
        this.loading = false;
        this.team = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Request all available organization members
   */
  private fetchAllMembers() {
    members.index()
      .then((response) => {
        this.allMembers = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Does this team have members?
   */
  get hasMembers(): boolean {
    return this.team ? (this.team.members ? (this.team.members.length > 0) : false) : false;
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.fetchTeam();
    this.fetchAllMembers();
  }

  /**
   * The user wants to fetch a new copy of the invitation list
   */
  refresh() {
    this.loading = true;
    this.fetchTeam();
  }

  /**
   * Remove a member from this team
   */
  removeTeamMember(member: Member) {
    if (!this.team) {
      return;
    }
    teams.removeMember(this.team, member)
      .then(() => {
        if (this.team && this.team.members) {
          this.removeModel(this.team.members, member);
          this.toast({
            message: `${member.name} has been removed from this team.`,
            level: 'success'
          });
        }
      })
      .catch((error) => this.handleResponseErrors(error));
  }

  /**
   * Show the team editing form
   */
  showEditForm() {
    this.editedTeamName = this.team ? this.team.name : '';
    this.editFormVisible = true;
  }

  /**
   * Ask the server to update the team
   */
  submitTeamEdits() {
    if (this.team) {
      this.team.name = this.editedTeamName;
      teams.update(this.team)
        .then((response) => {
          this.team = response.data.data;
          this.updatingTeam = false;
        })
        .catch((error) => {
          this.handleResponseErrors(error);
        })
    }
  }

  /**
   * Validate new team name before updating
   */
  update() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.submitTeamEdits();
        this.updatingTeam = true;
        }
      });
  }
}
</script>

<style>

</style>
