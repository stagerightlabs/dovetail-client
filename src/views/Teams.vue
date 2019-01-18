<template>
  <main role="main" class="page">
    <header>
      <h1>Teams</h1>
      <aside>
        <button @click="showTeamForm" class="text-grey-light" id="btn-show-create-form">
          <icon name="add-outline" />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" :spin="loading" />
        </button>
      </aside>
    </header>
    <article v-if="creationFormVisible" class="mt-4">
      <section class="content">
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
              @keydown.enter.prevent="createTeam"
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
      <section v-if="teams.length" class="content">
        <div v-for="team in sortedTeams" :key="team.hashid" class="faux-row">
          <div class="text-2xl sm:w-1/3">{{ team.name }}</div>
          <div class="text-grey-darker sm:w-1/3">
            {{ team.members_count }} Team Members
          </div>
          <div class="">
            <button
              id="btn-show"
              @click="view(team)"
              class="btn btn-blue"
            >View</button>
          </div>
        </div>
      </section>
      <section v-else class="content">
        <p class="text-center py-8">There are no teams yet. <button v-if="!creationFormVisible" @click.prevent="showTeamForm">Would you like to add one?</button></p>
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
    this.$router.push({name: 'team', params: { hashid, slug: team.slug }});
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
        this.newTeamName = '';
        this.addOrUpdateModel(this.teams, response.data.data);
        this.creatingTeam = false;
        this.$validator.reset();
        this.toast({
          message: `Team '${response.data.data.name}' has been created.`,
          level: 'success'
        });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.creatingTeam = false;
      });
  }

  /**
   * Sort the team list alphabetically
   */
  get sortedTeams() {
    return this.teams.sort((a: Team, b: Team) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    })
  }
}
</script>

<style>

</style>
