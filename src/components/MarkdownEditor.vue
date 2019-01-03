<template>
  <div>
    <div v-if="showPreview" class="markdown-preview p-2 border-b mb-4 overflow-scroll" v-html="compiledMarkdown"></div>
    <div class="input-group" v-else>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        class="w-full border font-mono"
        v-model="plainText"
      ></textarea>
    </div>
    <div class="flex justify-between">
      <div>
        <a class="btn btn-link text-sm" href="https://commonmark.org/help/" target="_blank">Markdown</a>
      </div>
      <div>
        <button class="btn" :class="{'btn-slate': showPreview, 'btn-link': !showPreview}" @click="togglePreview">
          <span v-if="showPreview">Edit</span>
          <span v-else>Preview</span>
        </button>
        <button class="btn btn-blue ml-2">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Emoji from 'markdown-it-emoji';
import MarkdownIt from 'markdown-it';
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({})
export default class MarkdownEditor extends Vue {

  showPreview: boolean = false;
  plainText: string = '';

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  // Render the markdown preview
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

    return md.render(this.plainText);
  }
}
</script>
