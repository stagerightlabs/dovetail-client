<template>
  <div v-if="loading" class="center-xy">
    <icon name="refresh" width="128" height="128" class="text-grey-light" spin></icon>
  </div>
  <main v-else role="main" class="page">
    <header>
      <h1>{{ team.name }}</h1>
      <aside>
        <button @click="showEditForm" class="text-grey-light" title="Edit" id="btn-show-create-form">
          <icon name="edit-pencil"  />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" title="Refresh" id="btn-refresh">
          <icon name="refresh" :spin="refreshing" />
        </button>
        <router-link :to="{name: 'teams'}" class="text-grey-light  ml-4" title="Back">
          <icon name="arrow-thick-left" />
        </router-link>
      </aside>
    </header>
    <article v-if="editFormVisible">
      <section class="content">
        <form class="content flex items-start">
          <label for="edit-team-name" class="pt-2">Name:</label>
          <div class="ml-2 flex-grow">
            <input
              type="text"
              name="name"
              class="leading-none"
              id="edit-team-name"
              v-model="editedTeamName"
              ref="editedTeamNameInput"
              @keydown.esc="cancelEditing"
              @keydown.enter="update"
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
            prevent
          >
            Update
          </action-button>
          <button
            class="btn btn-red ml-2"
            @click.prevent="cancelEditing"
          >
            Cancel
          </button>
        </form>
      </section>
    </article>
    <article>
      <header>
        <h3>Members ({{ team.members.length }})</h3>
        <aside class="flex items-center" v-if="availableMembers.length">
          <type-ahead-select
            :options="availableMembers"
            display="name"
            @select="addMember"
            placeholder="Add Member..."
            id="select-add-member"
          />
          <icon name="add-outline" class="ml-4" />
        </aside>
      </header>
      <section v-if="hasMembers" class="content">
        <div
          v-for="member in team.members"
          :key="member.hashid"
          class="faux-row flex justify-between items-baseline"
        >
          <p>{{ member.name }}</p>
          <button
            id="btn-remove-member"
            @click="removeTeamMember(member)"
            class="btn btn-red"
          >Remove</button>
        </div>
      </section>
      <section v-else class="content">
        <p class="text-center py-8">This team has no members.</p>
      </section>
    </article>
    <article>
      <header>
        <h3>Danger Zone</h3>
      </header>
      <section class="content">
        <p class="flex justify-between max-w-sm mx-auto items-baseline">
          Remove this team
          <action-button
            class="btn btn-red"
            :spin="deletingTeam"
            @click="destroy"
            confirm
            :message="`Are you sure you want to delete this team?`"
          >Delete</action-button>
        </p>
      </section>
    </article>
    <footer v-if="allMembers.length === 1">
      <p>There are no users available to add to teams. <router-link :to="{name: 'invitations'}">Invite users to join your organization</router-link>.</p>
    </footer>
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
import TypeAheadSelect from '@/components/TypeAheadSelect.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton, TypeAheadSelect }
})
export default class TeamView extends mixins(BaseView) {
  @Prop({ required: true }) hashid!: string;

  team: Team|null = null;
  allMembers: Member[] = [];
  loading: boolean = true;
  refreshing: boolean = false;
  editFormVisible: boolean = false;
  editedTeamName: string = '';
  updatingTeam: boolean = false;
  deletingTeam: boolean = false;

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
   * The list of organization members who are not already a member of this team
   */
  get availableMembers() {
    if (!this.team || !this.team.members) {
      return this.allMembers;
    }

    return this.allMembers.filter((member) => {
        return this.team!.members!.findIndex((i: Member) => i.hashid === member.hashid) === -1;
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
    if (this.userIsNotAllowedToSeeThisPage) {
      return;
    }

    teams.show(this.hashid)
      .then((response) => {
        this.loading = false;
        this.refreshing = false;
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
    if (this.userIsNotAllowedToSeeThisPage) {
      return;
    }

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
    this.refreshing = true;
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
    this.$nextTick(() => {
      this.$refs.editedTeamNameInput.focus();
    })
  }

  /**
   * Ask the server to update the team
   */
  submitTeamEdits() {
    if (this.team) {
      this.team.name = this.editedTeamName;
      teams.update(this.team, this.editedTeamName)
        .then((response) => {
          this.team = response.data.data;
          this.updatingTeam = false;
          if (!this.team) {
            return;
          }
          this.toast({
            message: `Team '${this.team.name}' has been updated.`,
            level: 'success'
          });
        })
        .catch((error) => {
          this.handleResponseErrors(error);
          this.updatingTeam = false;
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
          this.cancelEditing();
        }
      });
  }

  destroy() {
    if (!this.team) {
      return;
    }
    this.deletingTeam = true;
    teams.delete(this.team)
      .then((response) => {
        this.toast({
          message: `Team '${this.team!.name}' has been deleted.`,
          level: "success"
        });
        this.$router.push({name: 'teams'});
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.deletingTeam = false;
      });
  }
}
</script>

<style>

</style>
