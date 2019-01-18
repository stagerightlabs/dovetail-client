<template>
<main role="main" class="page">
  <header>
    <h1>Categories</h1>
    <aside>
      <button @click="showCreationForm" class="text-grey-light" id="btn-new">
        <icon name="add-outline"></icon>
      </button>
      <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
        <icon name="refresh"></icon>
      </button>
    </aside>
  </header>

  <article v-if="creationFormVisible">
    <section class="content">
      <form class="flex items-start">
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
          prevent
        >Save</action-button>
        <button
          class="btn btn-red ml-2"
          @click="cancelCreation"
        >Close</button>
      </form>
    </section>
  </article>

  <article>
    <section v-if="categories.length" class="content">
      <div
        v-for="category in categories"
        :key="category.hashid"
        class="faux-row"
      >
        <template v-if="isEditing(category)" >
          <div class="inline-flex items-center ">
            <label>Name:</label>
            <div>
              <input
                type="text"
                id="text-name"
                class="ml-2"
                v-model="editing.name"
                ref="editCategoryInput"
                name="name"
                @keyup.enter="update(category)"
                @keyup.esc="cancelUpdate"
                required
                v-validate
              >
              <div class="input-error">{{ errors.first('name') }}</div>
            </div>
          </div>
          <div>
            <action-button
              id="btn-update"
              class="btn btn-green mr-2"
              :spin="submittingUpdates"
              @click="update(category)"
            >Save</action-button>
            <button
              id="btn-cancel"
              class="btn btn-red"
              @click="cancelUpdate"
            >Cancel</button>
          </div>
        </template>
        <template v-else >
          <div class="text-2xl">{{ category.name }}</div>
          <div>
            <button
              id="btn-edit"
              @click="edit(category)"
              class="btn btn-green mr-2"
            >
              <icon name="edit-pencil" />
            </button>
            <action-button
              class="btn btn-red"
              id="btn-destroy"
              @click="destroy(category)"
              :spin="category.waitingForPromise === 'delete'"
              :message="`Remove the '${category.name}' category?`"
              :confirm="true"
            >
              <icon name="trash" />
            </action-button>
          </div>
        </template>
      </div>
    </section>
    <section v-else class="content text-center">
      <p>
        There are no categories available.
        <span v-if="!creationFormVisible">
          <a @click.prevent="showCreationForm">Would you like to add one?</a>
        </span>
      </p>
    </section>
  </article>

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
    newCategoryNameInput: HTMLFormElement,
    editCategoryInput: HTMLFormElement[],
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
   * Are there categories available?
   */
  get categoriesAvailable() {
    return this.categories.length > 0;
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
    this.$nextTick(() => {
      this.$refs.editCategoryInput[0].focus()
    })
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
        this.submittingUpdates = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.submittingUpdates = false;
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
        this.creatingCategory = false;
        this.newCategoryName = '';
        this.$refs.newCategoryNameInput.focus();
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.creatingCategory = false;
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
