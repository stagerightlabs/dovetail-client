<template>
  <div>
    <div @click="show">
      <slot></slot>
    </div>
    <portal to="modal" v-if="visible">
      <div class="fixed pin w-full h-full flex" @keydown.esc="hide">
        <div class="center-xy bg-smoke">
          <div class="fixed pin-t pin-r text-white mr-2 mt-2 cursor-pointer" @click="hide">
            <icon name="close" width="22" height="22" />
          </div>
          <div class="text-white text-center p-8 max-h-screen">
            <img :src="src" class="max-h-full" />
            <p v-if="caption" class="text-center">{{ caption }}</p>
          </div>
        </div>
      </div>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';

@Component({})
export default class LightBox extends Vue {

  @Prop({ required: true }) src!: string;
  @Prop({ default: '' }) caption!: string;

  visible: boolean = false;

  /**
   * Show the light box modal
   */
  show() {
    this.visible = true;
  }

  /**
   * Hide the lightbox modal
   */
  hide() {
    this.visible = false;
  }

  /**
   * The 'mounted' event lifecycle hook
   */
  mounted() {
    // Escape key event listener
    const escapeHandler = (e: any) => {
      if (this.visible && e.key === 'Escape') {
        this.hide();
      }
    };

    // Bind the event
    document.addEventListener('keydown', escapeHandler);

    // Register this event listener to be removed when the component is destroyed
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', escapeHandler);
    });

  }
}
</script>
