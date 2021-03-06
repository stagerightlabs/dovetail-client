<template>
  <button
    :class="{'disabled': spin}"
    @click="handleClick"
    :style="[spin && autoSizing ? {width: `${clientWidth}px`, height: `${clientHeight}px`} : {}]"
    :id="id"
    :disabled="disabled || spin"
  >
    <span v-if="spin">
      <icon name="refresh" width="20" height="20" spin></icon>
    </span>
    <span v-else>
      <slot></slot>
    </span>
    <portal to="modal" v-if="modalVisible">
      <div class="fixed pin w-full h-full flex">
        <div class="center-xy bg-smoke">
            <div class="modal">
              <div class="text-black font-bold text-xl mb-8">{{ message }}</div>
              <div class="flex justify-end">
                <button
                  class="btn btn-red mr-4"
                  @click="cancel"
                  id="modal-btn-cancel"
                >{{ cancelLabel }}</button>
                <button
                  class="btn btn-green"
                  @click="agree"
                  id="modal-btn-confirm"
                >{{ confirmLabel }}</button>
              </div>
            </div>
        </div>
      </div>
    </portal>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class ActionButton extends Vue {
  @Prop({ default: ''}) id!: string;
  @Prop({ default: 'Cancel' }) cancelLabel!: string;
  @Prop({ default: 'Confirm'}) confirmLabel!: string;
  @Prop({ default: false, type: Boolean }) spin!: boolean;
  @Prop({ default: false, type: Boolean}) prevent!: boolean;
  @Prop({ default: false, type: Boolean }) confirm!: boolean;
  @Prop({ default: false, type: Boolean }) disabled!: boolean;
  @Prop({ default: true, type: Boolean }) autoSizing!: boolean;
  @Prop({ default: 'Are you sure you want to do that?' }) message!: string;

  @Watch('spin')
  onPropertyChanged(value: boolean, oldValue: boolean) {
    this.captureClientSize()
  }

  clientWidth: number = 0;
  clientHeight: number = 0;
  modalVisible = false;

  /**
   * Process a click event
   */
  handleClick(e: any) {
    this.captureClientSize();

    if (this.prevent) {
      e.preventDefault();
    }

    if (this.confirm) {
      this.modalVisible = true;
    } else {
      this.$emit('click');
    }
  }

  /**
   * The user wants to proceed
   */
  agree() {
    this.modalVisible = false;
    this.$emit('click');
  }

  /**
   * The user wants to cancel
   */
  cancel() {
    this.modalVisible = false;
  }

  /**
   * The 'mounted' event lifecycle hook
   */
  mounted() {
    // Escape key event listener
    const escapeHandler = (e: any) => {
      if (this.modalVisible && e.key === 'Escape') {
        this.cancel();
      }
    };

    // Bind the event
    document.addEventListener('keydown', escapeHandler);

    // Register this event listener to be removed when the component is destroyed
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', escapeHandler);
    });

  }

  private captureClientSize() {
    this.clientWidth = this.$el.clientWidth;
    this.clientHeight = this.$el.clientHeight;
  }
}
</script>
