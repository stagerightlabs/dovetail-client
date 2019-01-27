<template>
  <section
    class="dropzone"
    :class="{highlight}"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="attachments-header  flex justify-center">
      <div class="btn btn-blue my-1 text-center" :disabled="uploading" id="file-upload-wrapper">
        <span v-if="uploading">
          <icon name="refresh" width="20" height="20" spin></icon>
        </span>
        <template v-else>
          <span class="text-sm flex">
            <icon name="add-outline" />
            <span class="ml-1">Add</span>
          </span>
          <input
            type="file"
            name="upload"
            id="file-upload"
            multiple
            @change="onFileChanged"
          />
        </template>
      </div>
    </div>
    <div class="attachments" ref="attachmentsContainer">
      <div class="attachment" v-for="attachment in documents" :key="attachment.hashid">
        <p v-if="isPdf(attachment)" :title="title(attachment)">
          <a :href="attachment.original" target="_blank" class="flex">
            <icon name="document" class="mr-1"/>
            {{ attachment.filename }}
          </a>
        </p>
        <p v-else :title="title(attachment)">
          <light-box
            class="cursor-pointer"
            :src="attachment.original"
            :caption="attachment.filename"
          >
            <icon name="photo" class="mr-1"/>
            <span class="underline">{{ attachment.filename }}</span>
          </light-box>
        </p>
        <action-button
          class="ml-1 text-grey-darker"
          confirm
          :message="`Are you sure you want to remove ${attachment.filename}?`"
          prevent
          @click="remove(attachment)"
          :spin="isDeleting(attachment)"
        >
          <icon name="trash" />
        </action-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Document } from '@/types';
import { AxiosPromise } from 'axios';
import BaseView from '@/mixins/BaseView.ts';
import { mixins } from 'vue-class-component';
import LightBox from '@/components/LightBox.vue';
import attachments from '@/repositories/pageDocuments';
import ActionButton from '@/components/ActionButton.vue';
import { Prop, Component } from 'vue-property-decorator';

@Component({
  components: { ActionButton, LightBox }
})
export default class NotebookPageAttachments extends mixins(BaseView) {

  @Prop({ required: true }) documents!: Document[];
  @Prop({ default: true, type: Boolean}) enabled!: boolean;
  @Prop({ required: true }) notebookId!: string;
  @Prop({ required: true }) pageId!: string;

  private highlight = false;
  private uploading = false;
  private deleting: Document|null = null;

  /**
   * Element refs
   */
  $refs!: {
    attachmentsContainer: HTMLElement,
  }

  /**
   * Handle a dragover event
   */
  onDragOver(event: DragEvent): void {
    if (!this.enabled) return;
    if (this.uploading) return;
    event.preventDefault();
    this.highlight = true;
  }

  /**
   * Handle a dragleave event
   */
  onDragLeave(event: DragEvent): void {
    this.highlight = false;
  }

  /**
   * Handle a drop event
   */
  onDrop(event: DragEvent): void {
    if (!this.enabled) return;
    event.preventDefault();
    if (event.dataTransfer) {
      this.upload(event.dataTransfer.files);
    }
  }

  /**
   * Handle a selection from the file selector
   */
  onFileChanged(event: any) {
    this.upload(event.target.files);
  }

  /**
   * Ask the server to remove a document
   */
  remove(attachment: Document) {
    this.deleting = attachment;
    attachments.delete(this.notebookId, this.pageId, attachment.hashid)
      .then((response) => {
        this.$emit('removed', attachment);
        this.toast({
          message: `${attachment.filename} has been removed.`,
          level: 'success'
        });
        this.deleting = null;
      })
      .catch((error) => {
        this.handleResponseErrors(error);
      })
  }

  /**
   * Determine if we are actively deleting a given document
   */
  isDeleting(attachment: Document) {
    if (!this.deleting) {
      return;
    }

    return this.deleting.hashid === attachment.hashid;
  }

  /**
   * Is this document a PDF?
   */
  isPdf(attachment: Document) {
    return attachment.mimetype == 'application/pdf';
  }

  /**
   * Generate a hover title for this attachment
   */
  title(attachment: Document) {
    return attachment.filename + ' - ' + attachment.uploaded_by;
  }

  /**
   * Upload the chosen files to to the server
   */
  private upload(files: FileList) {
    this.uploading = true;
    let promises = [];

    for (let i = 0; i < files.length; i++) {
      if (!files.item(i)) {
        return;
      }
      promises.push(
        // @ts-ignore
        attachments.store(this.notebookId, this.pageId, files.item(i))
          .then((response: any) => {
            this.$emit('document', response.data.data)
            this.$nextTick(() => {
              this.$refs.attachmentsContainer.scrollTop = this.$refs.attachmentsContainer.scrollHeight;
            })
          })
      );
    }

    Promise.all(promises)
      .catch((error) => {
        Object.keys(error.response.data.errors).forEach((key) => {
          this.toast({
            message: error.response.data.errors[key].shift(),
            level: 'danger'
          });
        });
      })
      .finally(() => {
        this.uploading = false;
      })
  }
}
</script>

<style>
#file-upload-wrapper {
  position: relative;
  overflow: hidden;
  width: 5rem;
}
#file-upload {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
  height: 100%;
}

.dropzone.highlight {
  @apply .border-4 border-blue border-dashed;
}
</style>
