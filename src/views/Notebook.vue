<template>
  <div v-if="loading" class="center-xy">
    <icon name="reload" width="48px"></icon>
  </div>
  <main v-else role="main" class="page">
    <header class="max-w-2xl">
      <h1>
        {{ notebook.name }}
        <span v-if="notebook.category" class="category-label">{{ notebook.category }}</span>
      </h1>
      <aside>
        <button @click="showEditForm" class="text-grey-light" id="btn-show-create-form">
          <icon name="edit-pencil" />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" />
        </button>
      </aside>
    </header>
    <article v-if="editFormVisible" class="max-w-2xl">
      <section class="content">
        <div class="bg-grey-lighter rounded w-full">
          <form class="max-w-sm mx-auto p-4">
            <label for="edit-notebook-name" class="pt-2">Name:</label>
            <div class="input-group">
              <input
                type="text"
                name="name"
                class="leading-none"
                id="edit-notebook-name"
                v-model="editedNotebookName"
                ref="editedNotebookNameInput"
                @keydown.esc="cancelEditing"
                @keydown.enter.prevent="update"
                required
                v-validate
              >
              <div class="input-error flex-none">{{ errors.first('name') }}</div>
            </div>
              <div class="input-group">
              <label for="new-notebook-category">Category:</label>
              <select
                name="category"
                v-model="editedNotebookCategory"
                id="edit-notebook-category"
                @keydown.esc="cancelEditing"
              >
                <option selected></option>
                <option v-for="category in categories" :key="category.hashid" :value="category.hashid">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="text-right">
              <action-button
                id="btn-update"
                class="btn btn-green ml-2"
                @click="update"
                @keydown.esc="cancelEditing"
                :spin="updatingNotebook"
                prevent
              >
                Update
              </action-button>
              <button
                class="btn btn-red ml-2"
                @keydown.esc="cancelEditing"
                @click.prevent="cancelEditing"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </article>
    <article class="notebook">
      <notebook-page
        :page="page"
        :notebook-id="notebook.hashid"
        v-for="page in notebook.pages"
        :key="page.hashid"
        :id="`notebook-page-${page.hashid}`"
        :ref="`notebook-page-${page.hashid}`"
        @removed="removePage(page)"
      />
    </article>

    <article>
      <header>
        <h3>Add Page</h3>
      </header>
      <section class="content max-w-2xl">
        <div class="content">
          <markdown-editor
            id="textarea-markdown"
            @saved="createPage"
            v-model="newNotebookPageContent"
            @cancelled="cancelNewPageCreation"
            allow-cancel
          ></markdown-editor>
        </div>
      </section>
    </article>
  </main>
</template>

<script lang="ts">
import pages from '@/repositories/pages';
import cloneDeep from 'lodash.clonedeep';
import BaseView from '@/mixins/BaseView.ts';
import members from '@/repositories/members';
import { mixins } from 'vue-class-component';
import notebooks from '@/repositories/notebooks';
import categories from '@/repositories/categories';
import { Action, Getter, Mutation } from 'vuex-class';
import { Prop, Component } from 'vue-property-decorator'
import ActionButton from '@/components/ActionButton.vue';
import NotebookPage from '@/components/NotebookPage.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { Notebook, Member, NotebookPage as Page, Category } from '@/types';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton, MarkdownEditor, NotebookPage }
})
export default class NotebookView extends mixins(BaseView) {

  @Prop({ required: true }) hashid!: string;

  notebook: Notebook|null = null;
  loading: boolean = true;
  editFormVisible: boolean = false;
  editedNotebookName: string = '';
  editedNotebookCategory: string = '';
  updatingNotebook: boolean = false;
  newNotebookPageContent: string = '';
  categories: Category[] = [];

  /**
   * Element refs
   */
  $refs: any = {
    editedNotebookNameInput: HTMLFormElement
  }

  /**
   * Cancel editing
   */
  cancelEditing() {
    this.editFormVisible = false;
    this.editedNotebookName = '';
    this.editedNotebookCategory = '';
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
    this.processQueryParameters();
    this.fetchCategories();
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
    this.editedNotebookCategory = this.notebook ? String(this.notebook.category_id) : '';
    this.editFormVisible = true;
    this.$nextTick(() => {
      this.$refs.editedNotebookNameInput.focus();
    })
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

  /**
   * Ask the server to update the notebook
   */
  submitNotebookEdits() {
    if (this.notebook) {
      this.notebook.name = this.editedNotebookName;
      this.notebook.category_id = this.editedNotebookCategory;
      notebooks.update(this.notebook)
        .then((response) => {
          this.notebook = response.data.data;
          this.updatingNotebook = false;
          this.cancelEditing();
        })
        .catch((error) => {
          this.handleResponseErrors(error);
        })
    }
  }

  /**
   * Ask the server to create a new notebook page
   */
  createPage(content: string) {
    if (content.length === 0) {
      this.toast({
        message: "No content provided",
        level: 'danger'
      });
      return;
    }

    if (!this.notebook) {
      return;
    }

    pages.create(this.notebook.hashid, content)
      .then((response) => {

        if (!this.notebook) {
          return;
        }

        if (!this.notebook.pages) {
          this.notebook.pages = [];
        }

        this.notebook.pages.push(response.data.data);
        this.newNotebookPageContent = '';
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Cancel new page creation and reset the markdown form
   */
  cancelNewPageCreation() {
    this.newNotebookPageContent = '';
  }

  /**
   * Remove a page from this notebook
   */
  removePage(page: Page) {
    if (this.notebook && this.notebook.pages) {
      this.removeModel(this.notebook.pages, page);
    }
  }

  /**
   * Scroll the window to a specific page
   */
  scrollToPage(pageId: string) {
    const ref = `notebook-page-${pageId}`;
    if (this.$refs[ref]) {
      this.$nextTick(() => {
        this.$refs[ref][0].$el.scrollIntoView();
      });
    }
  }

  /**
   * Handle query parameters
   */
  processQueryParameters() {
    // Has a specific page been specified?
    if (this.$route.query.page) {
      this.$nextTick(() => {
        // Unfortunately we need to wait a bit more before we can access the DOM
        setTimeout(() => {
          this.scrollToPage(String(this.$route.query.page));
        }, 500);
      });
    }
    // How about a specific comment?
    else if (this.$route.query.comment) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (!this.notebook || !this.notebook.pages) {
            return;
          }

          const page = this.notebook.pages.find((page: any) => {
            if (!page) {
              return;
            }

            return page.comments && page.comments.filter((comment: any) => {
              return comment.hashid == this.$route.query.comment;
            }).length;
          });
          if (page) {
            this.scrollToPage(page.hashid);
          }
        }, 500);
      });
    }
  }

  /**
   * Fetch the available categories
   */
  private fetchCategories() {
    categories.index()
      .then((response) => {
        this.categories = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }
}
</script>

<style>

</style>
