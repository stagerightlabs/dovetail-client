<template>
<div v-if="loading" class="center-xy">
  <!-- <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon> -->
</div>
<main v-else role="main" class="page">
  <div class="page-header flex justify-between items-center ">
    <h1>Categories</h1>
    <div>
      <button @click="showCreationForm" class="text-grey-light" id="btn-new">
        <!-- <fa-icon icon="plus" ></fa-icon> New -->
      </button>
      <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
        <!-- <fa-icon icon="sync-alt" ></fa-icon> Refresh -->
      </button>
    </div>
  </div>
  <div v-if="creationFormVisible" class="content flex items-start">
      <label for="new-category-name" class="pt-2">Name:</label>
      <div class="ml-2 flex-grow">
        <input
          type="text"
          name="name"
          class="leading-none"
          id="new-category-name"
          v-model="newCategoryName"
          ref="newCategoryNameInput"
          @keydown.esc="cancelCreation"
          @keydown.enter="create"
          required
          v-validate
        >
        <div class="input-error flex-none">{{ errors.first('name') }}</div>
      </div>
      <action-button
        id="btn-create"
        class="btn btn-green ml-2"
        @click="create"
        :spin="creatingCategory"
      >
        Save
      </action-button>
      <button
        class="btn btn-red ml-2"
        @click="cancelCreation"
      >
        Cancel
      </button>
    </div>
  <div v-for="category in categories" :key="category.hashid">
    <div v-if="isEditing(category)">
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
        <action-button id="btn-update" :spin="submittingUpdates" @click="update(member)">Update</action-button>
        <button id="btn-cancel" @click="cancelUpdate">Cancel</button>
      </div>
    </div>
    <div v-else>
      <h3>{{ category.name }}</h3>
      <button id="btn-edit" @click="edit(category)">
        <!-- <fa-icon icon="edit"></fa-icon> -->
        Edit
      </button>
      <button id="btn-delete" @click="destroy(category)">Remove</button>
    </div>
  </div>
</main>
</template>

<script lang="ts">
import Vue from 'vue';
import { Category } from '@/types';
import cloneDeep from 'lodash.clonedeep';
import BaseView from '@/mixins/BaseView.ts';
import categories from '@/repositories/categories';
import Component, { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton }
})
export default class Categories extends mixins(BaseView) {

  loading: boolean = false;
  categories: Category[] = [];
  editing: Category|null = null;
  creationFormVisible: boolean = false;
  newCategoryName: string = '';
  submittingUpdates: boolean = false;
  creatingCategory: boolean = false;

  /**
   * Element refs
   */
  $refs!: {
    newCategoryNameInput: HTMLFormElement
  }

  /**
   * Hide the category creation form
   */
  cancelCreation() {
    this.creationFormVisible = false;
    this.newCategoryName = '';
  }

  /**
   * Hide the category editing form
   */
  cancelUpdate() {
    this.editing = null;
  }

  /**
   * Validate the category creation form
   */
  create() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid) {
        this.submitNewCategory();
        this.creatingCategory = true;
        }
      })
  }

  /**
   * Ask the server to remove a category
   */
  destroy(category: Category) {
    categories.delete(category)
      .then(() => {
        this.removeModel(this.categories, category);
        this.toast({
          message: `Category '${category.name}' has been removed`,
          level: 'success'
        });
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Flag a category for editing
   */
  edit(category: Category) {
    this.editing = cloneDeep(category);
  }

  /**
   * Ask the server for the current category list
   */
  fetchCategories() {
    this.loading = true;
    categories.index()
      .then((response) => {
        this.categories = response.data.data;
        this.loading = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Determine if a category is currently being edited
   */
  isEditing(category: Category): boolean {
    return this.editing
      ? this.editing.hashid === category.hashid
      : false;
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    this.fetchCategories();
  }

  /**
   * Request an updated category list from the server
   */
  refresh() {
    this.fetchCategories();
  }

  /**
   * Ask the serve to update a category
   */
  requestUpdate(category: Category) {
    categories.update(category)
      .then((response) => {
        this.addOrUpdateModel(this.categories, response.data.data);
        this.editing = null;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Show the category creation form
   */
  showCreationForm() {
    this.creationFormVisible = true;
  }

  /**
   * Ask the server to create a new category
   */
  private submitNewCategory() {
    categories.create(this.newCategoryName)
      .then((response) => {
        this.addOrUpdateModel(this.categories, response.data.data);
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Validate the category creation form
   */
  update() {
    this.$validator.validateAll()
      .then((valid) => {
        if (valid && this.editing) {
          this.requestUpdate(this.editing);
          this.submittingUpdates = true;
        }
      })
  }

}
</script>

<style>

</style>
