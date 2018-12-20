<template>
  <div v-if="loading" class="center-xy">
    <icon name="refresh" width="128" height="128" class="text-grey-light" spin></icon>
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>Notebooks</h1>
      <div>
        <button @click="showNotebookForm" class="text-grey-light" id="btn-show-create-form">
          <icon name="add-outline" />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" />
        </button>
      </div>
    </div>
    <div v-if="creationFormVisible" class="content flex items-start">
      <button id="hello">dd</button>
      <label for="new-notebook-name" class="pt-2">Name:</label>
      <div class="ml-2 flex-grow">
        <input
          type="text"
          name="name"
          class="leading-none"
          id="new-notebook-name"
          v-model="newNotebookName"
          ref="newNotebookInput"
          @keydown.esc="cancelNewNotebook"
          @keydown.enter="create"
          required
          v-validate
        >
        <div class="input-error flex-none">{{ errors.first('name') }}</div>
      </div>
      <action-button
        id="btn-create"
        class="btn btn-green ml-2"
        @click="createNotebook"
        :spin="creatingNotebook"
      >
        Send
      </action-button>
      <button
        class="btn btn-red ml-2"
        @click="cancelNotebookCreation"
      >
        Cancel
      </button>
    </div>
    <div v-for="notebook in notebooks" :key="notebook.hashid">
      <h3>{{ notebook.name }}</h3>
      <button id="btn-show" @click="view(notebook)">View</button>
    </div>
  </main>
</template>

<script lang="ts">
import { Notebook, Member } from '@/types';
import cloneDeep from 'lodash.clonedeep';
import notebooks from '@/repositories/notebooks';
import BaseView from '@/mixins/BaseView.ts';
import { Action, Getter, Mutation } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class NotebooksView extends mixins(BaseView) {

  notebooks: Notebook[] = [];
  loading: boolean = true;
  creationFormVisible: boolean = false;
  newNotebookName: string|null = null;
  creatingNotebook: boolean = false;

  /**
   * Element refs
   */
  $refs!: {
    newNotebookInput: HTMLFormElement
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
        this.creatingNotebook = true;
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
    this.creatingNotebook = false;
    this.$nextTick(() => this.$validator.errors.clear());
  }

  /**
   * Request all available notebooks from the server
   */
  fetchNotebooks() {
    notebooks.index()
      .then((response) => {
        this.notebooks = response.data.data;
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
    this.fetchNotebooks();
  }

  /**
   * Ask the server to create a new notebook
   */
  private submitNewNotebook() {
    notebooks.create(String(this.newNotebookName))
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
