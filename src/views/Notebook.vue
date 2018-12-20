<template>
  <div v-if="loading" class="center-xy">
    <icon name="refresh" width="128" height="128" class="text-grey-light" spin></icon>
  </div>
  <main v-else role="main" class="page">
    <div class="page-header flex justify-between items-center ">
      <h1>{{ notebook.name }}</h1>
      <div>
        <button @click="showEditForm" class="text-grey-light" id="btn-show-create-form">
          <icon name="edit-pencil" />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" />
        </button>
      </div>
    </div>
    <div v-if="editFormVisible" class="content flex items-start">
      <label for="edit-notebook-name" class="pt-2">Name:</label>
      <div class="ml-2 flex-grow">
        <input
          type="text"
          name="name"
          class="leading-none"
          id="edit-notebook-name"
          v-model="editedNotebookName"
          ref="editedNotebookNameInput"
          @keydown.esc="cancelNewNotebook"
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
        :spin="updatingNotebook"
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
      <div v-if="hasMembers" v-for="member in notebook.members" :key="member.hashid">
        <p>{{ member.name }}</p>
        <button id="btn-remove-member" @click="removeNotebookMember(member)">Remove</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Notebook, Member } from '@/types';
import cloneDeep from 'lodash.clonedeep';
import notebooks from '@/repositories/notebooks';
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
export default class NotebookView extends mixins(BaseView) {
  @Prop({ required: true }) hashid!: string;

  notebook: Notebook|null = null;
  loading: boolean = true;
  editFormVisible: boolean = true;
  editedNotebookName: string = '';
  updatingNotebook: boolean = false;

  /**
   * Element refs
   */
  $refs!: {
    editedNotebookNameInput: HTMLFormElement
  }

  /**
   * Cancel editing
   */
  cancelEditing() {
    this.editFormVisible = false;
    this.editedNotebookName = '';
  }

  /**
   * Request notebook information from the server
   */
  private fetchNotebook() {
    notebooks.show(this.hashid)
      .then((response) => {
        this.loading = false;
        this.notebook = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.fetchNotebook();
  }

  /**
   * The user wants to fetch a new copy of the invitation list
   */
  refresh() {
    this.loading = true;
    this.fetchNotebook();
  }

  /**
   * Show the notebook editing form
   */
  showEditForm() {
    this.editedNotebookName = this.notebook ? this.notebook.name : '';
    this.editFormVisible = true;
  }

  /**
   * Ask the server to update the notebook
   */
  submitNotebookEdits() {
    if (this.notebook) {
      this.notebook.name = this.editedNotebookName;
      notebooks.update(this.notebook)
        .then((response) => {
          this.notebook = response.data.data;
          this.updatingNotebook = false;
        })
        .catch((error) => {
          this.handleResponseErrors(error);
        })
    }
  }

  /**
   * Validate new notebook name before updating
   */
  update() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.submitNotebookEdits();
        this.updatingNotebook = true;
        }
      });
  }
}
</script>

<style>

</style>
