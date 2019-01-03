<template>
  <main role="main" class="page">
    <header>
      <h1>{{ notebook.name }}</h1>
      <aside>
        <button @click="showEditForm" class="text-grey-light" id="btn-show-create-form">
          <icon name="edit-pencil" />
        </button>
        <button @click="refresh" class="text-grey-light ml-4" id="btn-refresh">
          <icon name="refresh" />
        </button>
      </aside>
    </header>
    <article v-if="editFormVisible">
      <section>
        <form class="flex items-start">
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
              @keydown.enter.prevent="create"
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
            prevent
          >
            Send
          </action-button>
          <button
            class="btn btn-red ml-2"
            @click.prevent="cancelEditing"
          >
            Cancel
          </button>
        </form>
      </section>
    </article>
    <article class="notebook">
      <section class="notebook-page">
        <div class="content">
          <h2>hello world</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe quos eos nisi ut illo consectetur libero voluptates ducimus quidem! Nisi odit odio illum, esse amet adipisci obcaecati tempore pariatur consectetur.</p>
        </div>
        <aside>
          <section class="options">
            <button title="Edit">
              <icon name="edit-pencil"/>
            </button>
            <button title="Conversation">
              <icon name="conversation"/>
              (12)
            </button>
            <button title="Add Attachment">
              <icon name="attachment" />
            </button>
            <button title="Remove Page">
              <icon name="cog" />
            </button>
          </section>
          <section class="conversation hidden">
            <button class="add-comment">
              <icon name="add-outline" width="12" height="12" />
              Add Comment
            </button>
          </section>
        </aside>
      </section>
      <section class="notebook-page">
        <div class="content">
          <h2>hello world</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe quos eos nisi ut illo consectetur libero voluptates ducimus quidem! Nisi odit odio illum, esse amet adipisci obcaecati tempore pariatur consectetur.</p>
        </div>
        <aside>
          <section class="options">
            <button title="Edit">
              <icon name="edit-pencil"/>
            </button>
            <button title="Conversation">
              <icon name="conversation" class="text-blue" />
              (12)
            </button>
            <button title="Add Attachment">
              <icon name="attachment" />
            </button>
            <button title="Remove Page">
              <icon name="cog" />
            </button>
          </section>
          <section class="conversation">
            <div class="comment">
              <p class="px-2 pt-1">
                <icon name="user-solid-circle" width="24" height="24" />
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda aspernatur fugit rerum cum neque porro cumque vel est, deserunt amet dolore praesentium quidem ratione temporibus unde culpa perferendis dolor. Eius!</p>
            </div>
            <div class="comment">
              <p class="px-2 pt-1">
                <icon name="user-solid-circle" width="24" height="24" />
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda aspernatur fugit rerum cum neque porro cumque vel est, deserunt amet dolore praesentium quidem ratione temporibus unde culpa perferendis dolor. Eius!</p>
            </div>
            <div class="comment">
              <p class="px-2 pt-1">
                <icon name="user-solid-circle" width="24" height="24" />
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda aspernatur fugit rerum cum neque porro cumque vel est, deserunt amet dolore praesentium quidem ratione temporibus unde culpa perferendis dolor. Eius!</p>
            </div>
            <button class="add-comment">
              <icon name="add-outline" width="12" height="12" />
              Add Comment
            </button>
          </section>
        </aside>
      </section>
       <section class="notebook-page">
        <div class="content">
          <h2>hello world</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe quos eos nisi ut illo consectetur libero voluptates ducimus quidem! Nisi odit odio illum, esse amet adipisci obcaecati tempore pariatur consectetur.</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe quos eos nisi ut illo consectetur libero voluptates ducimus quidem! Nisi odit odio illum, esse amet adipisci obcaecati tempore pariatur consectetur.</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe quos eos nisi ut illo consectetur libero voluptates ducimus quidem! Nisi odit odio illum, esse amet adipisci obcaecati tempore pariatur consectetur.</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe quos eos nisi ut illo consectetur libero voluptates ducimus quidem! Nisi odit odio illum, esse amet adipisci obcaecati tempore pariatur consectetur.</p>
        </div>
        <aside>
          <section class="options">
            <button title="Edit">
              <icon name="edit-pencil"/>
            </button>
            <button title="Conversation">
              <icon name="conversation" />
              (12)
            </button>
            <button title="Add Attachment">
              <icon name="attachment" class="text-blue" />
              (3)
            </button>
            <button>
              <icon name="cog" />
            </button>
          </section>
          <section class="conversation hidden">
            <div class="comment">
              <p class="px-2">
                <icon name="user-solid-circle" width="24" height="24" />
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda aspernatur fugit rerum cum neque porro cumque vel est, deserunt amet dolore praesentium quidem ratione temporibus unde culpa perferendis dolor. Eius!</p>
            </div>
            <div class="comment">
              <p class="px-2">
                <icon name="user-solid-circle" width="24" height="24" />
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda aspernatur fugit rerum cum neque porro cumque vel est, deserunt amet dolore praesentium quidem ratione temporibus unde culpa perferendis dolor. Eius!</p>
            </div>
            <div class="comment">
              <p class="px-2">
                <icon name="user-solid-circle" width="24" height="24" />
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda aspernatur fugit rerum cum neque porro cumque vel est, deserunt amet dolore praesentium quidem ratione temporibus unde culpa perferendis dolor. Eius!</p>
            </div>
            <button class="add-comment">
              <icon name="add-outline" width="12" height="12" />
              Add Comment
            </button>
          </section>
          <section class="attachments">
            <div class="attachment">
              <p class="px-2">
                <icon name="attachment" width="24" height="24" />
              </p>
              <p><a href="#">really_long_filename.pdf</a></p>
            </div>
            <div class="attachment">
              <p class="px-2">
                <icon name="attachment" width="24" height="24" />
              </p>
              <p><a href="#">really_long_filename.pdf</a></p>
            </div>
            <div class="attachment">
              <p class="px-2">
                <icon name="attachment" width="24" height="24" />
              </p>
              <p><a href="#">really_long_filename.pdf</a></p>
            </div>
            <button class="add-attachment">
              <icon name="add-outline" width="12" height="12" />
              Add Attachment
            </button>
          </section>
        </aside>
      </section>

    </article>

    <article>
      <header>
        <h3>Add Page</h3>
      </header>
      <section class="content">
        <div class="content">
          <markdown-editor></markdown-editor>
        </div>
      </section>
    </article>
  </main>
</template>

<script lang="ts">
import cloneDeep from 'lodash.clonedeep';
import { Notebook, Member } from '@/types';
import BaseView from '@/mixins/BaseView.ts';
import members from '@/repositories/members';
import { mixins } from 'vue-class-component';
import notebooks from '@/repositories/notebooks';
import { Action, Getter, Mutation } from 'vuex-class';
import { Prop, Component } from 'vue-property-decorator'
import ActionButton from '@/components/ActionButton.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';

@Component({
  $_veeValidate: { validator: "new" },
  components: { ActionButton, MarkdownEditor }
})
export default class NotebookView extends mixins(BaseView) {
  @Prop({ required: true }) hashid!: string;

  notebook: Notebook|null = null;
  loading: boolean = true;
  editFormVisible: boolean = false;
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
