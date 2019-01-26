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
        <button title="Add Attachment" @click="attachments" @keydown.esc="read" class="flex justify-center">
          <icon name="attachment" :class="{'text-blue': isAttachments}" />
          <span class="text-xs ml-1" v-if="page.documents && page.documents.length > 0">({{ page.documents.length }})</span>
        </button>
        <button title="Information" @keydown.esc="read" @click="activity" class="flex justify-center">
          <icon name="information-outline" :class="{'text-blue': isActivity}" />
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
        :visible="isConversation"
      />
      <notebook-page-attachments
        :notebookId="notebookId"
        :pageId="page.hashid"
        :documents="page.documents ? page.documents : []"
        :class="{'hidden': !isAttachments}"
        @document="receiveDocument"
        @removed="removeDocument"
      />
      <section :class="{'hidden': !isActivity}">
        <div class="p-2 overflow-scroll" style="max-height: 16rem">
          <div
            v-for="activity in reversedActivity"
            :key="activity.hashid"
            class="w-full text-sm text-grey-dark border-t p-1 mb-1 break-words"

          >
            <p>
              {{ activity.description }}
            </p>
            <p class="flex justify-between items-center text-xs mt-1">
              <span>{{ activity.since_created }}</span>
              <span>{{ activity.user_name }}</span>
            </p>
          </div>
        </div>
      </section>
    </aside>
  </section>
</template>

<script lang="ts">
import { format } from 'date-fns';
import { markdown } from '@/markdown';
import pages from '@/repositories/pages';
import BaseView from '@/mixins/BaseView.ts';
import { mixins } from 'vue-class-component';
import ActionButton from '@/components/ActionButton.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { Prop, Component, Watch } from 'vue-property-decorator';
import { NotebookPage as Page, NotebookPageComment, Document } from '@/types';
import NotebookPageAttachments from '@/components/NotebookPageAttachments.vue';
import NotebookPageConversation from '@/components/NotebookPageConversation.vue';

@Component({
  components: { MarkdownEditor, ActionButton, NotebookPageConversation, NotebookPageAttachments }
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
        this.refreshActivityLog();
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
        this.read();
      return;
    }

    this.mode = 'conversation';
  }

  /**
   * Enter comments mode
   */
  activity() {
      if (this.mode === 'activity') {
        this.read();
      return;
    }

    this.mode = 'activity';
  }

  /**
   * Enter attachments mode
   */
  attachments() {
    if (this.mode === 'attachments') {
      this.read();
      return;
    }

    this.mode = 'attachments';
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
    return this.mode === 'conversation';
  }

  /**
   * Are we in conversation mode?
   */
  get isActivity() {
    return this.mode === 'activity';
  }

  /**
   * Are we in attachments mode?
   */
  get isAttachments() {
    return this.mode === 'attachments';
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

    this.refreshActivityLog();
    this.addOrUpdateModel(this.page.comments, comment);
  }

  /**
   * Receive a new document attachment
   */
  receiveDocument(attachment: Document) {
    if (!this.page.documents) {
      this.page.documents = [];
    }

    this.refreshActivityLog();
    this.addOrUpdateModel(this.page.documents, attachment);
  }

  /**
   * Remove a delete document from the page's document list
   */
  removeDocument(attachment: Document) {
     if (!this.page.documents) {
      return;
    }

    this.refreshActivityLog();
    this.removeModel(this.page.documents, attachment);
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

  /**
   * Fetch the page activity again
   */
  refreshActivityLog() {
    pages.fetchActivity(this.notebookId, this.page.hashid)
      .then((response) => {
        this.page.activity = response.data.data;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Return the activity list in reverse order
   */
  get reversedActivity() {
    if (!this.page.activity) {
      return [];
    }

    return this.page.activity.reverse();
  }
}
</script>
