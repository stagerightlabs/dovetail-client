<template>
  <section class="notebook-page">
    <div v-if="isReading" class="content w-full" v-html="compiledMarkdown"></div>
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
        <button title="Edit" @click="edit">
          <icon name="edit-pencil" :class="{'text-blue': isEditing}"/>
        </button>
        <button title="Conversation">
          <icon name="conversation"/>
          (12)
        </button>
        <button title="Add Attachment">
          <icon name="attachment" />
        </button>
        <button title="Manage">
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
</template>

<script lang="ts">
import { markdown } from '@/markdown';
import pages from '@/repositories/pages';
import BaseView from '@/mixins/BaseView.ts';
import { mixins } from 'vue-class-component';
import { NotebookPage as Page } from '@/types';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { Prop, Component, Watch } from 'vue-property-decorator';

@Component({
  components: { MarkdownEditor }
})
export default class NotebookPage extends mixins(BaseView) {

  @Prop({ required: true }) page!: Page;
  @Prop({ required: true }) notebookId!: string;

  mode: string = 'read';
  originalContent = this.page.content;

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
      })


  }

  /**
   * Ender read mode
   */
  read() {
    this.mode = 'read';
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
}
</script>
