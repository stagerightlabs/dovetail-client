const PurgecssPlugin = require('purgecss-webpack-plugin');
const whitelister = require('purgecss-whitelister');
const glob = require('glob-all');
const path = require('path');

class TailwindExtractor {
  static extract (content) {
    return content.match(/[A-z0-9-:\/]+/g) || [];
  }
}

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      // new PurgecssPlugin({
      //   paths: glob.sync([
      //     path.join(__dirname, './src/index.html'),
      //     path.join(__dirname, './**/*.vue'),
      //     path.join(__dirname, './src/**/*.js'),
      //   ]),
      //   whitelist: [],
      //   extractors: [
      //     {
      //       extractor: TailwindExtractor,

      //       // Specify the file extensions to include when scanning for
      //       // class names.
      //       extensions: ['html', 'js', 'php', 'vue'],
      //     },
      //   ],
      // }),
    ],
  },
};
