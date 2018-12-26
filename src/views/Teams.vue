<template>
  <main role="main" class="page">
    <header>
      <h1>Teams</h1>
      <aside>
        <button @click="showTeamForm" class="text-grey-light" id="btn-show-create-form">
          <icon name="add-outline" />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" />
        </button>
      </aside>
    </header>
    <article v-if="creationFormVisible" class="mt-4">
      <section>
        <form class="flex items-start">
          <label for="new-team-name" class="pt-2">Name:</label>
          <div class="ml-2 flex-grow">
            <input
              type="text"
              name="name"
              class="leading-none"
              id="new-team-name"
              v-model="newTeamName"
              ref="newTeamInput"
              @keydown.esc="cancelTeamCreation"
              @keydown.enter="createTeam"
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
            prevent
          >
            Send
          </action-button>
          <button
            class="btn btn-red ml-2"
            @click.prevent="cancelTeamCreation"
          >
            Cancel
          </button>
        </form>
      </section>
    </article>
    <article >
      <section v-if="teams.length">
        <div v-for="team in teams" :key="team.hashid" class="faux-row flex justify-between items-center">
          <div class="text-2xl">{{ team.name }}</div>
          <div class="text-grey-darker">
            {{ team.members.length }} Team Members
          </div>
          <div>
            <button
              id="btn-show"
              @click="view(team)"
              class="btn btn-blue"
            >View</button>
          </div>
        </div>
      </section>
      <section v-else>
        <p class="text-center py-8">There are no teams.</p>
      </section>
    </article>
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
        this.addOrUpdateModel(this.teams, response.data.data);
        this.creatingTeam = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.creatingTeam = false;
      });
  }
}
</script>

<style>

</style>
