<template>
<div v-if="loading" class="center-xy">
  <fa-icon icon="spinner" spin class="text-grey-light" size="4x"></fa-icon>
</div>
<main v-else role="main" class="page">
  <div class="page-header flex justify-between items-center ">
    <h1>Categories</h1>
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
        <label>Title:</label>
        <input
          type="text"
          id="text-name"
          v-model="editing.title"
          name="title"
        >
        <div class="input-error">{{ errors.first('title') }}</div>
      </div>
      <div class="input-group">
        <label>E-mail:</label>
        <input
          type="email"
          id="text-email"
          v-model="editing.email"
          name="email"
          required
          v-validate
        >
        <div class="input-error">{{ errors.first('title') }}</div>
      </div>
      <div class="input-group">
        <action-button id="btn-update" :spin="submittingUpdates" @click="update(member)">Update</action-button>
        <button id="btn-cancel" @click="cancelUpdate">Cancel</button>
      </div>
    </div>
    <div v-else>
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
  submittingUpdates: boolean = false;
  creatingCategory: boolean = false;

  /**
   * Ask the server for the current category list
   */
  fetchCategories() {
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
   * The mounted lifecycle hook
   */
  mounted() {
    this.fetchCategories();
  }

  /**
   * Determine if a category is currently being edited
   */
  isEditing(category: Category): boolean {
    return this.editing
      ? this.editing.hashid === category.hashid
      : false;
  }
}
</script>

<style>

</style>
