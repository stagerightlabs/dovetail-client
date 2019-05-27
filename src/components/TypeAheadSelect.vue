<template>
  <div class="typeahead relative">
    <input
      type="text"
      :class="inputClass"
      :placeholder="placeholder"
      @input="onInput($event.target.value)"
      @keyup.esc="isOpen = false"
      @blur="isOpen = false"
      @keydown.down="moveDown"
      @keydown.up="moveUp"
      @keydown.enter="select"
      v-model="keyword"
      :id="id"
    >
    <ul
      class="flex flex-col w-full absolute border border-grey bg-white z-40"
      v-show="isOpen">
      <li v-for="(option,index) in filteredOptions"
        class="cursor-pointer w-full p-2 border-b truncate text-grey-darker"
        :class="{
          'bg-grey-light': index === highlightedPosition
        }"
        :key=index
        @click="select(option)"
        @mouseenter="highlightedPosition = index"
        @mousedown="select"
      >{{ option[display] }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class TypeAheadSelect extends Vue {

  @Prop({ required: true, type: Array }) options!: any[];
  @Prop({ default: false, type: Boolean }) allowNew!: boolean;
  @Prop({ default: 'Select...', type: String }) placeholder!: string;
  @Prop({ default: 'searchable', type: String }) display!: string;
  @Prop({ default: '', type: String }) inputClass!: string;
  @Prop({ default: null, type: String }) id!: string|null;

  keyword: string = '';
  isOpen: boolean = false;
  selectedOption: any = {};
  highlightedPosition: number = 0;

  /**
   * The user has added input to the <input>
   */
  onInput(value: any) {
    this.isOpen = !!value;
    this.highlightedPosition = 0;
  }

  /**
   * Move the highlighted position down
   */
  moveDown() {
    if (!this.isOpen) {
      return;
    }
    this.highlightedPosition = (this.highlightedPosition + 1) % this.filteredOptions.length;
  }

  /**
   * Move the highlighted position up
   */
  moveUp() {
    if (!this.isOpen) {
      return;
    }
    this.highlightedPosition = this.highlightedPosition - 1 < 0
      ? this.filteredOptions.length - 1
      : this.highlightedPosition - 1;
  }

  /**
   * The user wants to select an option
   */
  select() {
    this.selectedOption = this.filteredOptions[this.highlightedPosition];

    if (!this.selectedOption && this.allowNew) {
      // We are adding an existing author
      this.selectedOption = { [this.display]: this.keyword };
    }

    if (!this.selectedOption) {
      this.$emit('invalid-selection', this.keyword);
      this.keyword = '';
      this.isOpen = false;
      return;
    }

    this.$emit('select', this.selectedOption);
    this.keyword = '';
    this.isOpen = false;
  };

  /**
   * Filter the available options based on the user's input
   */
  get filteredOptions() {
    const re = new RegExp(this.keyword, 'i');
    return this.options.filter(o => o[this.display].match(re));
  };

};
</script>
