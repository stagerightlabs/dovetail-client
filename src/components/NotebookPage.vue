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
        <button title="Edit" @click="edit" @keydown.esc="read" class="flex justify-center">
          <icon name="edit-pencil" :class="{'text-blue': isEditing}" />
        </button>
        <button title="Conversation" @click="conversation" @keydown.esc="read" class="flex justify-center">
          <icon name="conversation"  :class="{'text-blue': isConversation}"/>
          <span class="text-xs ml-1" v-if="page.comments && page.comments.length > 0">({{ page.comments.length }})</span>
        </button>
        <button title="Add Attachment" @keydown.esc="read" class="flex justify-center">
          <icon name="attachment" />
          <span class="text-xs ml-1">(12)</span>
        </button>
        <button title="Information" @keydown.esc="read" class="flex justify-center">
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
      <notebook-page-conversation :class="{'hidden': !isConversation}"
        :notebookId="notebookId"
        :pageId="page.hashid"
        :comments="page.comments ? page.comments : []"
        @comment="receiveComment"
      />
    </aside>
  </section>
</template>

<script lang="ts">
import { format } from 'date-fns';
import { markdown } from '@/markdown';
import pages from '@/repositories/pages';
import BaseView from '@/mixins/BaseView.ts';
import { mixins } from 'vue-class-component';
import { NotebookPage as Page, NotebookPageComment } from '@/types';
import ActionButton from '@/components/ActionButton.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { Prop, Component, Watch } from 'vue-property-decorator';
import NotebookPageConversation from '@/components/NotebookPageConversation.vue';

@Component({
  components: { MarkdownEditor, ActionButton, NotebookPageConversation }
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

  /**
   * Receive a new comment
   */
  receiveComment(comment: NotebookPageComment) {
    if (!this.page.comments) {
      this.page.comments = [];
    }

    this.addOrUpdateModel(this.page.comments, comment);
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {
    // If a specific comment has been requested via query parameter, display it
    if (this.$route.query.comment
        && this.page.comments
        && this.page.comments.find((c) => this.$route.query.comment === c.hashid)
      ) {
      this.conversation();
    }
  }
}
</script>
