/*
 * Copyright 2026 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Copyright 2026 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Copyright 2026 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import filters from './config/filters.js';
import pairedShortcodes from './config/paired-shortcodes.js';
import shortcodes from './config/shortcodes.js';
import plugins from './config/plugins/index.js';
import pluginIcons from 'eleventy-plugin-icons';

export default async function (eleventyConfig) {
  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Paired Shortcodes
  Object.keys(pairedShortcodes).forEach((shortcodeName) => {
    eleventyConfig.addPairedShortcode(shortcodeName, pairedShortcodes[shortcodeName]);
  });

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // Plugins
  Object.keys(plugins).forEach((pluginName) => {
    eleventyConfig.addPlugin(plugins[pluginName]);
  });

  // Generates a dynamic sprite to <use> icons with {% icon "file-name" %}
  // Place icon svgs in assets/icons
  // @link https://www.npmjs.com/package/eleventy-plugin-icons
  eleventyConfig.addPlugin(pluginIcons, {
    mode: 'sprite',
    sources: [{ name: 'default', path: './src/assets/icons', default: true }],
    sprite: {
      attributes: {
        width: 0,
        height: 0,
      },
    },
  });

  // passthroughs
  eleventyConfig.addPassthroughCopy('src/assets/css/styles.css');
  eleventyConfig.addPassthroughCopy('src/assets/images');

  return {
    dir: {
      output: 'dist',
      input: 'src',
      layouts: '_layouts',
    },
  };
}
