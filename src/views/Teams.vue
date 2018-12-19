<template>
  <div v-if="loading" class="center-xy">
    <!-- <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon> -->
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Teams</h1>
      <div>
        <button @click="showTeamForm" class="text-grey-light" id="btn-show-create-form">
          <!-- <fa-icon icon="plus" ></fa-icon> New -->
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <!-- <fa-icon icon="sync-alt" ></fa-icon> Refresh -->
        </button>
      </div>
    </div>
    <div v-if="creationFormVisible" class="content flex items-start">
      <button id="hello">dd</button>
      <label for="new-team-name" class="pt-2">Name:</label>
      <div class="ml-2 flex-grow">
        <input
          type="text"
          name="name"
          class="leading-none"
          id="new-team-name"
          v-model="newTeamName"
          ref="newTeamInput"
          @keydown.esc="cancelNewTeam"
          @keydown.enter="create"
          required
          v-validate
        >
        <div class="input-error flex-none">{{ errors.first('name') }}</div>
      </div>
      <action-button
        id="btn-create"
        class="btn btn-green ml-2"
        @click="createTeam"
        :spin="creatingTeam"
      >
        Send
      </action-button>
      <button
        class="btn btn-red ml-2"
        @click="cancelTeamCreation"
      >
        Cancel
      </button>
    </div>
    <div v-for="team in teams" :key="team.hashid">
      <h3>{{ team.name }}</h3>
      <button id="btn-show" @click="view(team)">View</button>
    </div>
  </main>
</template>

<script lang="ts">
import { Team, Member } from '@/types';
import cloneDeep from 'lodash.clonedeep';
import teams from '@/repositories/teams';
import BaseView from '@/mixins/BaseView.ts';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class TeamsView extends mixins(BaseView) {

  teams: Team[] = [];
  loading: boolean = true;
  creationFormVisible: boolean = false;
  newTeamName: string|null = null;
  creatingTeam: boolean = false;

  /**
   * Element refs
   */
  $refs!: {
    newTeamInput: HTMLFormElement
  }

  /**
   * Navigate to a team detail page
   */
  view(team: Team) {
    const hashid = team.hashid;
    this.$router.push({name: 'team', params: { hashid }});
  }

  /**
   * Refresh the team list
   */
  refresh() {
    this.loading = true;
    this.fetchTeams();
  }

  /**
   * Display the team creation form
   */
  showTeamForm() {
    this.creationFormVisible = true;
    this.$nextTick(() => this.$refs.newTeamInput.focus())
  }

  /**
   * Ensure our invitation request is valid before making the API call
   */
  createTeam() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.submitNewTeam();
        this.creatingTeam = true;
        }
      })
  }

  /**
   * Hide and reset the team creation form
   */
  cancelTeamCreation() {
    this.creationFormVisible = false;
    this.resetTeamForm();
  }

  /**
   * Reset the team creation form
   */
  resetTeamForm() {
    this.newTeamName = null;
    this.creatingTeam = false;
    this.$nextTick(() => this.$validator.errors.clear());
  }

  /**
   * Request all available teams from the server
   */
  fetchTeams() {
    teams.index()
      .then((response) => {
        this.teams = response.data.data;
        this.loading = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.fetchTeams();
  }

  /**
   * Ask the server to create a new team
   */
  private submitNewTeam() {
    teams.create(String(this.newTeamName))
      .then((response) => {
        // this.addOrUpdate(this.)
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }
}
</script>

<style>

</style>
