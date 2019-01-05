<template>
  <section class="notebook-page">
    <div v-if="!isEditing" class="content w-full markdown" v-html="compiledMarkdown"></div>
    <markdown-editor
      v-if="isEditing"
      class="w-full p-1"
      v-model="page.content"
      @cancelled="cancelEditing"
      @saved="updateContent"
      allow-cancel
    />
    <aside>
      <section class="options">
        <button title="Edit" @click="edit" class="flex justify-center">
          <icon name="edit-pencil" :class="{'text-blue': isEditing}" />
        </button>
        <button title="Conversation" @click="conversation" class="flex justify-center">
          <icon name="conversation"  :class="{'text-blue': isConversation}"/>
          <span class="text-xs ml-1">(12)</span>
        </button>
        <button title="Add Attachment" class="flex justify-center">
          <icon name="attachment" />
          <span class="text-xs ml-1">(12)</span>
        </button>
        <button title="Information" class="flex justify-center">
          <icon name="information-outline" />
        </button>
        <action-button
          title="Remove"
          :spin="deleting"
          @click="remove"
          message="Are you sure you want to remove this page?"
          confirm
          :autoSizing="false"
          class="flex justify-center"
        >
          <icon name="trash" />
        </action-button>
      </section>
      <section class="conversation" :class="{'hidden': !isConversation}">
        <button class="add-comment">
          <icon name="add-outline" width="12" height="12" />
          Add Comment
        </button>
        <notebook-page-comments
          :notebookId="notebookId"
          :pageId="page.hashid"
          :comments="page.comments"
        />
      </section>
    </aside>
  </section>
</template>

<script lang="ts">
import { markdown } from '@/markdown';
import pages from '@/repositories/pages';
import BaseView from '@/mixins/BaseView.ts';
import { mixins } from 'vue-class-component';
import { NotebookPage as Page } from '@/types';
import ActionButton from '@/components/ActionButton.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { Prop, Component, Watch } from 'vue-property-decorator';
import NotebookPageComments from '@/components/NotebookPageComments.vue';

@Component({
  components: { MarkdownEditor, ActionButton, NotebookPageComments }
})
export default class NotebookPage extends mixins(BaseView) {

  @Prop({ required: true }) page!: Page;
  @Prop({ required: true }) notebookId!: string;

  mode: string = 'read';
  originalContent = this.page.content;
  deleting: boolean = false;

  /**
   * Render the markdown preview
   */
  get compiledMarkdown() {
    return markdown.render(this.page.content);
  }

  /**
   * Allow the user to edit this page
   */
  edit() {
    if (this.mode === 'edit') {
      this.cancelEditing();
      return;
    }

    this.mode = 'edit';
  }

  /**
   * Cancel the edit operation and restore the original content
   */
  cancelEditing() {
    this.page.content = this.originalContent;
    this.read();
  }

  /**
   * Update the page content
   */
  updateContent(value: string) {
    pages.update(this.notebookId, this.page.hashid, value)
      .then((response) => {
        this.page.content = response.data.data.content;
        this.originalContent = response.data.data.content;
        this.read();
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }

  /**
   * Ender read mode
   */
  read() {
    this.mode = 'read';
  }

  /**
   * Enter comments mode
   */
  conversation() {
      if (this.mode === 'conversation') {
      // this.cancelConversation();
        this.read();
      return;
    }

    this.mode = 'conversation';
  }

  /**
   * Are we in edit mode?
   */
  get isEditing() {
    return this.mode === 'edit';
  }

  /**
   * Are we in read mode?
   */
  get isReading() {
    return this.mode === 'read';
  }

  /**
   * Are we in comment mode?
   */
  get isConversation() {
    return this.mode === 'conversation'
  }

  /**
   * Ask the server to delete this notebook page
   */
  remove() {
    this.deleting = true;
    pages.delete(this.notebookId, this.page.hashid)
      .then(() => {
        this.deleting = false;
        this.$emit('removed');
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      });
  }
}
</script>
