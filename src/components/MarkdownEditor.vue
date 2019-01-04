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
        @input="input"
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
        <button class="btn btn-blue ml-2" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Emoji from 'markdown-it-emoji';
import MarkdownIt from 'markdown-it';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class MarkdownEditor extends Vue {

  @Prop({ required: true }) value!: string;

  showPreview: boolean = false;
  plainText: string = this.value;

  @Watch('value')
  onPropertyChanged(value: string, oldValue: string) {
    this.plainText = value;
  }

  /**
   * Toggle the markdown preview panel
   */
  togglePreview() {
    this.showPreview = !this.showPreview;
  }

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

    return md.render(this.plainText);
  }

  /**
   * The user wants to save their content
   */
  save() {
    this.$emit('saved', this.plainText);
  }

  /**
   * Sync the
   */
  input() {
    this.$emit('input', this.plainText)
  }
}
</script>
