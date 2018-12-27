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
      class="flex flex-col w-full absolute list-reset border border-grey bg-white z-40"
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

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    allowNew: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Select...',
    },
    display: {
      type: String,
      default: 'searchable',
    },
    inputClass: {
      type: String,
      default: 'block appearance-none w-full border border-grey-dark text-grey-darkest py-3 px-4 pr-8 rounded',
    },
    id: {
      type: String|null,
      default: null
    }
  },
  data() {
    return {
      keyword: '',
      isOpen: false,
      selectedOption: {},
      highlightedPosition: 0,
    };
  },
  methods: {
    onInput(value) {
      this.isOpen = !!value;
      this.highlightedPosition = 0;
    },
    moveDown() {
      if (!this.isOpen) {
        return;
      }
      this.highlightedPosition = (this.highlightedPosition + 1) % this.filteredOptions.length;
    },
    moveUp() {
      if (!this.isOpen) {
        return;
      }
      this.highlightedPosition = this.highlightedPosition - 1 < 0
        ? this.filteredOptions.length - 1
        : this.highlightedPosition - 1;
    },
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
    },
  },
  computed: {
    filteredOptions() {
      const re = new RegExp(this.keyword, 'i');
      return this.options.filter(o => o[this.display].match(re));
    },
  },
};
</script>
