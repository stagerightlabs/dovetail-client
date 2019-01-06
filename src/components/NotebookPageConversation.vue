<template>
  <section>
    <div class="conversation" ref="conversationContainer">
      <div class="comment" v-for="comment in comments" :key="comment.hashid" :id="`page-comment-${comment.hashid}`">
        <template v-if="isEditing(comment)">
          <div class="flex-grow">
            <input
              type="text"
              v-model="editedCommentText"
              @keydown.esc="cancelEditing"
              ref="commentEditingInput"
            >
          </div>
          <action-button
            class="btn btn-blue ml-1 p-0"
            :spin="commenting"
            @click="updateComment(comment)"
            :autoSizing="false"
            style="height: 35px; width: 40px"
          ><icon name="add-outline" width="18" height="18" />
          </action-button>
        </template>
        <template v-else>
          <div class="px-2 pt-1" :title="comment.commentator">
            <icon name="user-solid-circle" width="24" height="24" />
          </div>
          <div class="flex-grow">
            <p>
              {{ comment.content }}
              <span class="text-xs text-grey" v-if="comment.edited">(edited)</span>
            </p>
            <p class="text-xs text-grey flex justify-end">
              <span :title="comment.created_at">{{ comment.since_created }}</span>
              <span v-if="user.hashid === comment.commentator_id">
                <button class="text-grey" @click="editComment(comment)" title="Edit">
                  <icon name="edit-pencil" height="10" width="10" class="ml-1" />
                </button>
              </span>
            </p>
          </div>
        </template>
      </div>
      <div v-if="!comments || comments.length === 0">
        <p class="text-center text-sm text-grey mt-4">No Comments</p>
      </div>
    </div>
    <div class="flex mx-1 mb-1">
      <div class="flex-grow">
        <input
          type="text"
          v-model="newComment"
          @keydown.enter.prevent="addComment"
        >
      </div>
      <action-button
        class="btn btn-blue ml-1 p-0"
        :spin="commenting"
        @click="addComment"
        :autoSizing="false"
        style="height: 37px; width: 43px"
      ><icon name="add-outline" width="18" height="18" />
      </action-button>
    </div>

  </section>
</template>

<script lang="ts">
import { Getter } from 'vuex-class';
import { markdown } from '@/markdown';
import BaseView from '@/mixins/BaseView.ts';
import { mixins } from 'vue-class-component';
import pageComments from '@/repositories/pageComments';
import ActionButton from '@/components/ActionButton.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { Prop, Component, Watch } from 'vue-property-decorator';
import { NotebookPage as Page, NotebookPageComment, User } from '@/types';

@Component({
  components: { MarkdownEditor, ActionButton }
})
export default class NotebookPageComments extends mixins(BaseView) {

  @Prop({ required: true }) comments!: NotebookPageComment[];
  @Prop({ required: true }) notebookId!: string;
  @Prop({ required: true }) pageId!: string;
  @Getter('user', {namespace: 'session'}) user! : User;

  newComment: string = '';
  commenting: boolean = false;
  editing: NotebookPageComment|null = null;
  editedCommentText: string = '';
  updatingComment: boolean = false;

  /**
   * Element refs
   */
  $refs!: {
    conversationContainer: HTMLFormElement
    commentEditingInput: HTMLFormElement
  }

  /**
   * Add a new comment
   */
  addComment() {
    if (this.newComment.length === 0) {
      return;
    }
    this.commenting = true;
    pageComments.store(this.notebookId, this.pageId, this.newComment)
      .then((response) => {
        this.$emit('comment', response.data.data);
        this.newComment = '';
        this.commenting = false;
        this.$nextTick(() => {
          this.$refs.conversationContainer.scrollTop = this.$refs.conversationContainer.scrollHeight;
        })
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * The user wants to edit one of their comments
   */
  editComment(comment: NotebookPageComment) {
    this.editedCommentText = comment.content;
    this.editing = comment;
    this.$nextTick(() => {
      const el = <HTMLFormElement>this.$refs.commentEditingInput[0];
      if (el) {
        el.focus();
      }
    })
  }

  updateComment(comment: NotebookPageComment) {
    this.updatingComment = true;
    pageComments.update(this.notebookId, this.pageId, comment.hashid, this.editedCommentText)
      .then((response) => {
        this.$emit('comment', response.data.data);
        this.cancelEditing();
        this.updatingComment = false;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
        this.updatingComment = false;
      })
  }

  /**
   * Determine if a particular comment has been flagged for editing
   */
  isEditing(comment: NotebookPageComment) {
    if (!this.editing) {
      return false
    }

    return this.editing.hashid === comment.hashid;
  }

  /**
   * Close the comment editing form
   */
  cancelEditing() {
    this.editing = null;
    this.editedCommentText = '';
  }

  /**
   * The mounted lifecycle hook
   */
  mounted() {

    // If a comment id has been requested via a query parameter,
    // Lets find it and scroll it into view
    if (this.$route.query.comment) {
      // Attempt to find the comment DOM node
      const comment = this.$el.querySelector(`#page-comment-${this.$route.query.comment}`)
      // If it exists, scroll it into view
      if (comment) {
        this.$nextTick(() => {
          // @ts-ignore
          this.$refs.conversationContainer.scrollTop = comment.offsetTop;
        })
      }
    }
  }

}
</script>


<style>
.flexbox .stretch { flex: 1; }
.flexbox .normal { flex: 0; margin: 0 0 0 1rem; }
</style>
