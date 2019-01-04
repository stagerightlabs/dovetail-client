import MarkdownIt from 'markdown-it';
import Emoji from 'markdown-it-emoji';

export let markdown = (new MarkdownIt())
  .set({
    html: true,
    breaks: true,
    typographer: true,
    linkify: true,
  }).enable('replacements')
    .enable('smartquotes')
    .use(Emoji);
