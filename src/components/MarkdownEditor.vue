<template>
  <div>
    <div
      v-if="showPreview"
      class="markdown p-2 border-b mb-4 overflow-scroll"
      v-html="compiledMarkdown"
      style="height: 12.9rem"
    ></div>
    <div class="input-group" v-else>
      <textarea
        name=""
        id="textarea-markdown"
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
        <button
          class="btn"
          :class="{'btn-slate': showPreview, 'btn-link': !showPreview}"
          @click="togglePreview"
        >
          <span v-if="showPreview">Edit</span>
          <span v-else>Preview</span>
        </button>
        <button
          id="btn-save-markdown"
          class="btn btn-blue ml-2"
          @click="save"
        >Save</button>
        <button
          v-if="allowCancel"
          class="btn btn-red ml-2"
          @click="cancel"
        >Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { markdown } from '@/markdown';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class MarkdownEditor extends Vue {

  @Prop({ required: true }) value!: string;
  @Prop({ default: true, type: Boolean }) allowCancel!: boolean;
  @Prop({ default: '' }) id!: string;

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
    return markdown.render(this.plainText);
  }

  /**
   * The user wants to save their content
   */
  save() {
    this.$emit('saved', this.plainText);
    this.showPreview = false;
  }

  /**
   * Sync the input value; used for v-model compatibility
   */
  input() {
    this.$emit('input', this.plainText)
  }

  /**
   *
   */
  cancel() {
    this.showPreview = false;
    this.$emit('cancelled');
  }
}
</script>
