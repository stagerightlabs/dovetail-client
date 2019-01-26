<template>
  <main role="main" class="page max-w-2xl">
    <header>
      <h1>{{ orgNotebooksLabel }}</h1>
      <aside>
        <button @click="showNotebookForm" class="text-grey-light" id="btn-show-create-form">
          <icon name="add-outline" />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" :spin="refreshing" />
        </button>
      </aside>
    </header>
    <article v-if="creationFormVisible">
      <header>
        <h3>Create New {{ singularNotebooksLabel }}</h3>
      </header>
      <section class="content">
        <div class="bg-grey-lighter rounded w-full">
          <form class="max-w-sm mx-auto p-4">
            <div class="input-group">
              <label for="new-notebook-name" class="pt-2">Name:</label>
              <input
                type="text"
                name="name"
                class="leading-none"
                id="new-notebook-name"
                v-model="newNotebookName"
                ref="newNotebookInput"
                @keydown.esc="cancelNotebookCreation"
                @keydown.enter.prevent="create"
                required
                v-validate
              >
              <div class="input-error flex-none">{{ errors.first('name') }}</div>
            </div>
            <div class="input-group">
              <label for="new-notebook-category">Category:</label>
              <select name="category" v-model="newNotebookCategory" id="new-notebook-category">
                <option selected></option>
                <option v-for="category in categories" :key="category.hashid" :value="category.hashid">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="input-group">
              <label for="new-notebook-owner">Owner</label>
              <select
                name="owner"
                v-model="newNoteBookOwner"
                id="new-notebook-owner"
                required
                v-validate
              >
                <option value="user" selected>{{ user.name }}</option>
                <option v-for="team in userTeams" :key="team.hashid" :value="team.hashid">
                  Team: {{ team.name }}
                </option>
                <option value="organization">{{ organization.name }}</option>
              </select>
            </div>
            <div class="input-group text-right">
              <action-button
                id="btn-create"
                class="btn btn-green ml-2"
                @click="createNotebook"
                :spin="creatingNotebook"
                prevent
              >
                Create
              </action-button>
              <button
                class="btn btn-red ml-2"
                @click.prevent="cancelNotebookCreation"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      </section>
    </article>
    <article>
      <header>
        <h3>&nbsp;</h3>
        <aside>
          <input
            type="text"
            placeholder="Filter..."
            v-model="filterString"
            ref='filterStringInput'
            @keydown.esc="clearFilterString"
          >
        </aside>
      </header>
      <section v-if="notebooks.length" class="content">
        <div class="sm:flex justify-between items-center font-bold text-sm hidden">
          <div class="sm:w-1/3">Name</div>
          <div class="sm:w-1/3">Category</div>
          <div class="sm:w-1/3">Owner</div>
        </div>
        <div v-for="notebook in filteredNotebooks" :key="notebook.hashid" class="faux-row">
          <div class="text-2xl sm:w-1/3">
            <router-link
              :to="{name: 'notebook', params: { hashid: notebook.hashid, slug: notebook.slug }}"
            >{{ notebook.name }}</router-link>
          </div>
          <div class="sm:w-1/3">{{ notebook.category }}</div>
          <div class="sm:w-1/3">{{ notebook.owner_name }}</div>
          <!-- <div class="w-1/4 text-right">
            <button
              id="btn-show"
              @click="view(notebook)"
              class="btn btn-blue"
            >View</button>
          </div> -->
        </div>
      </section>
      <section v-else class="content">
        <p class="text-center py-8">There are no {{ orgNotebooksLabel.toLowerCase() }} yet. <button @click.prevent="showNotebookForm">Would you like to create one?</button></p>
      </section>
    </article>
  </main>
</template>

<script lang="ts">
import BaseView from '@/mixins/BaseView.ts';
import profile from '@/repositories/profile';
import notebooks from '@/repositories/notebooks';
import categories from '@/repositories/categories';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';
import { Notebook, Member, Category, User, Team, Organization } from '@/types';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class NotebooksView extends mixins(BaseView) {

  @Getter('orgNotebooksLabel', {namespace: 'session'}) orgNotebooksLabel! : string;
  @Getter('isAdministrator', {namespace: 'session'}) isAdministrator! : boolean;
  @Getter('organization', {namespace: 'session'}) organization! : Organization;
  @Getter('user', {namespace: 'session'}) user! : User;

  notebooks: Notebook[] = [];
  categories: Category[] = [];
  userTeams: Team[] = [];
  loading: boolean = true;
  refreshing: boolean = false;
  creationFormVisible: boolean = false;
  newNotebookName: string|null = null;
  newNotebookCategory: string|null = null;
  newNoteBookOwner: string = 'user';
  creatingNotebook: boolean = false;
  filterString: string = '';

  /**
   * Element refs
   */
  $refs!: {
    newNotebookInput: HTMLFormElement,
    filterStringInput: HTMLFormElement,
  }

  /**
   * Navigate to a notebook detail page
   */
  view(notebook: Notebook) {
    const hashid = notebook.hashid;
    this.$router.push({name: 'notebook', params: { hashid }});
  }

  /**
   * Refresh the notebook list
   */
  refresh() {
    this.loading = true;
    this.fetchNotebooks();
    this.fetchCategories();
    this.fetchUserTeams();
  }

  /**
   * Display the notebook creation form
   */
  showNotebookForm() {
    this.creationFormVisible = true;
    this.$nextTick(() => this.$refs.newNotebookInput.focus())
  }

  /**
   * Ensure our invitation request is valid before making the API call
   */
  createNotebook() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
          this.submitNewNotebook();
        }
      })
  }

  /**
   * Hide and reset the notebook creation form
   */
  cancelNotebookCreation() {
    this.creationFormVisible = false;
    this.resetNotebookForm();
  }

  /**
   * Reset the notebook creation form
   */
  resetNotebookForm() {
    this.newNotebookName = null;
    this.newNoteBookOwner = 'user';
    this.creatingNotebook = false;
    this.newNotebookCategory = null;
    this.$nextTick(() => this.$validator.errors.clear());
  }

  /**
   * Request all available notebooks from the server. Administrators will see all notebooks,
   * regular users will only see notebooks that are available to them.
   */
  fetchNotebooks() {
    (this.isAdministrator ? notebooks.index() : profile.notebooks())
      .then((response) => {
        this.notebooks = response.data.data;
        this.loading = false;
        this.refreshing = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Fetch the available categories
   */
  fetchCategories() {
    categories.index()
      .then((response) => {
        this.categories = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Fetch the teams that this user has joined
   */
  fetchUserTeams() {
    profile.teams()
      .then((response) => {
        this.userTeams = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.fetchNotebooks();
    this.fetchCategories();
    this.fetchUserTeams();
  }

  /**
   * Filter our list of notebooks by fuzzy matching against a search string
   */
  get filteredNotebooks() {
    if (this.filterString.length === 0) {
      return this.notebooks;
    }

    const re = new RegExp(this.filterString, 'i');
    return this.notebooks.filter(n => {
      return n.name.match(re)
        || String(n.category).match(re)
        || n.owner_name.match(re);
    });
  }

  /**
   * Clear the filter query string
   */
  clearFilterString() {
    this.filterString = '';
    this.$refs.filterStringInput.blur();
  }

  /**
   * Ask the server to create a new notebook
   */
  private submitNewNotebook() {

    this.creatingNotebook = true;

    // Build the parameter set
    let parameters: any = {
      name: String(this.newNotebookName),
      category_id: String(this.newNotebookCategory),
    }

    // Determine an appropriate owner ID
    if (this.newNoteBookOwner == 'user') {
      parameters.owner_id = this.user.hashid;
    } else if (this.newNoteBookOwner == 'organization') {
      // Do nothing
    } else {
      parameters.team_id = this.newNoteBookOwner;
    }

    // Create the new notebook
    notebooks.create(parameters)
      .then((response) => {
        this.addOrUpdateModel(this.notebooks, response.data.data)
        this.cancelNotebookCreation();
        this.toast({
          message: `${this.singularNotebooksLabel} '${response.data.data.name}' has been created.`,
          level: 'success'
        });
        this.creatingNotebook = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.creatingNotebook = false;
      })
  }

  /**
   * Convert the org notebook label string to singular
   */
  get singularNotebooksLabel() {
    if (this.orgNotebooksLabel.endsWith('s')) {
      return this.orgNotebooksLabel.slice(0, -1);
    }
    return this.orgNotebooksLabel;
  }
}
</script>

<style>

</style>
