<template>
  <section class="notebook-page">
    <div class="content w-full" v-html="compiledMarkdown">

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
</template>

<script lang="ts">
import Emoji from 'markdown-it-emoji';
import MarkdownIt from 'markdown-it';
import { NotebookPage as Page } from '@/types';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class NotebookPage extends Vue {

  @Prop({ required: true }) page!: Page;

  /**
   * Render the markdown preview
   */
  get compiledMarkdown() {
    const md = new MarkdownIt();
    md.set({
      html: true,
      breaks: true,
      typographer: true,
      linkify: true,
    }).enable('replacements')
      .enable('smartquotes')
      .use(Emoji);

    return md.render(this.page.content);
  }
}
</script>
