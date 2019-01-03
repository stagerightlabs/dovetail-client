declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

// Ignore type checks for the portal-vue library
declare module 'portal-vue';

// Ignore type checks for the markdown-it library
declare module 'markdown-it';
declare module 'markdown-it-emoji';
